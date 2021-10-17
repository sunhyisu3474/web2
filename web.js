const express = require('express');
const server = express();
const port = 8001;
const database = require('./js/DB/database');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore(database.sessionDB);
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const time = require('./js/time');

require('colors');

server.set('views', __dirname + '\/client\/views');
server.set('view engine', 'ejs');

server.use(bodyParser.urlencoded({extended: false}));  // POST 방식 셋팅
server.use(express.static(__dirname));
server.use(express.static(__dirname + '\/client\/views'));
server.use(session({
  key: 'sunhyisu',  // 세션의 키 값
  secret: '#signature',  // 암호화 키 값
  store: sessionStore,
  resave: false,  // 세션을 항상 저장?
  saveUninitialized: true,
  cookie: {
    maxAge: 2400 * 60 * 60
  }
}));

server.listen(port, function (error) {
  if (error) {
    console.log(time.hour + '시 ' + time.minute + '분 ' + time.second + '초' + ' : ' + "에러가 발생");
    console.log(time.hour + '시 ' + time.minute + '분 ' + time.second + '초' + ' : ' + error);
  } else {
    console.log(time.hour + '시 ' + time.minute + '분 ' + time.second + '초' + ' : ' + "서버가 " + port + "번 포트로" + " 정상적으로 개방");
  }
});

server.get('/', function (request, response) {
  return response.render('index', {});
});

server.get('/login', function (request, response) {
  return response.render('login', {});
});

server.post('/login', function (request, response) {
  database.db.query(database.LOGIN_SQL, [request.body.login_id], function (error, accounts) {
    var data_pw = accounts[0].pw;
    if (error) {
      console.log(error);
    } else {
      console.log(accounts[0]);
      bcrypt.compare(request.body.login_pw, data_pw, function (error, isValue) {
        if (isValue) {
          console.log("[SIGN IN] ".blue + " 로그인 되었습니다.");
          return response.send(`<script>
            alert("로그인에 성공하였습니다.");
            location.href = '/';
            </script>`);
        } else if (!isValue) {
          console.log("[SIGN IN]  계정 정보가 일치하지 않습니다.");
          return response.send(`<script>
            alert("일치하는 계정 정보가 존재하지 않습니다.");
            location.href = '/login';
            </script>`)
        }
        database.db.destroy();  // 로그인 완료 된 경우 DB 연결을 종료한다.
      });
    }
  });
});

server.get('/register', function (request, response) {
  return response.render('register', {
    name: "관리자"
  });
});

server.post('/register', function (request, response) {
  if (request.body.registerPW !== "" && request.body.registerID.length >= 12 && request.body.registerPW_confirm === request.body.registerPW) {  // 계정 회원가입 유효성 검증
    bcrypt.genSalt(15, function (error, salt) {
      if (error) {
        console.log("[SIGN-UP] ".red + " salt 생성 중 에러 발생");
      } else {
        bcrypt.hash(request.body.registerPW, salt, function (error, hash) {
          if (error) {
            console.log("[SIGN-UP] ".red + " hash 변환 중 에러 발생");
          } else {
            request.body.registerPW = hash;
            database.db.query(database.REGISTER_SQL, [request.body.registerID, request.body.registerPW], function (ER_DUP_ENTRY, error) {
              if (ER_DUP_ENTRY) {
                console.log("[SIGN-UP] ".red + " 중복된 계정입니다.\n" + ER_DUP_ENTRY);
                return response.send(`<script>
                  alert("이미 존재하는 ID입니다.\\n로그인 페이지로 이동합니다.");
                  location.href = '/login';
                  </script>`);
              } else if (!ER_DUP_ENTRY) {
                console.log("[SIGN-UP] ".blue + " 새로운 계정이 생성되었습니다.");
                request.session.uid = request.body.registerID;
                return response.send(`<script>
        alert("계정이 생성되었습니다.\\n로그인 페이지로 이동합니다.");
        location.replace('login');
        </script>`);
              } else {
                throw error;
              }
            });
          }
        });
      }
    });
  } else if (request.body.registerPW_confirm !== request.body.registerPW) {
    return response.send(`<script>
    alert("입력하신 암호와 재확인 암호가 불일치합니다.\\n암호를 다시 한 번 확인해주세요.");
    history.back();
    </script>`);
  } else if (request.body.registerID.length < 12) {
    console.log("ID값이 12자 미만입니다.");
    return response.send(`<script>
    alert("ID 값은 최소 12자 이상으로 입력하세요.");
    history.back();
    </script>`);
  } else if (request.body.registerPW === "" || " ") {
    console.log("암호 규칙에 어긋납니다.");
    return response.send(`<script>
    alert("암호에 공백을 입력하셨습니다.\\n암호 규칙에 맞게 가입을 진행해주세요.");
    history.back();
    </script>`);
  }
});

server.get('/upload', function (request, response) {
  return response.render('upload', {});
});

server.post('/upload', function (request, response) {
  if (!request.body.title || !request.body.content) {
    console.log("제목 혹은 내용이 누락되었습니다.");
    return response.send(`<script>
      alert("제목 혹은 내용이 누락되었습니다.");
      location.href = '/upload';
      </script>`);
  } else {
    database.db.query(database.POST_CONTENTS, [request.body.title, request.body.content], function (error) {
      if (error) {
        console.log("데이터 처리 중 에러가 발생하였습니다.");
        return response.send(`<script>
      alert("데이터 처리 중 에러가 발생하였습니다.");
      location.href = '/upload';
      </script>`);
      } else {
        console.log("요청하신 데이터가 정상적으로 처리되었습니다.");
        return response.send(`<script>
      alert("요청하신 데이터가 정상적으로 처리되었습니다");
      location.href = '/upload';
      </script>`);
      }
    });
  }
});
