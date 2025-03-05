const uri = '/User/Login';
let token;
const formLoginUser = document.getElementById('loginUser');
const formLoginManeger = document.getElementById('loginManeger');


const start = () => {
    token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
        printSetences(token);
    } else {
        login();
    }
}

function isTokenValid(token) {
    // פיצול הטוקן לשלושה חלקים
    const parts = token.split('.');
    if (parts.length !== 3) {
        return false; // הטוקן לא תקין
    }

    // דקוד את ה-payload
    const payload = JSON.parse(atob(parts[1]));

    // קבלת תאריך התפוגה
    const exp = payload.exp; // exp הוא תאריך התפוגה ב-epoch time

    // השוואת תאריך התפוגה עם התאריך הנוכחי
    const currentTime = Math.floor(Date.now() / 1000); // זמן נוכחי ב-epoch time

    return exp > currentTime; // מחזיר true אם הטוקן עדיין בתוקף
}
//מציגה כפתורים לבחירת סוג כניסה ומסדרת את פונקצית 
// onclick עבור כל סוג לוגין
const login = () => {
    const IManeger = document.getElementById('IManeger');
    const IUser = document.getElementById('IUser');
    IManeger.style.display = 'inline-block';
    IUser.style.display = 'inline-block';

    IUser.onclick = () => {
        IManeger.style.display = 'none';
        IUser.style.display = 'none';
        formLoginUser.style.display = 'inline-block';
        formLoginUser.onsubmit = (e) => {
            e.preventDefault();
            loginUser(e);
        }
    }
    IManeger.onclick = () => {
        IManeger.style.display = 'none';
        IUser.style.display = 'none';
        formLoginManeger.style.display = 'inline-block';
        formLoginManeger.onsubmit = (e) => {
            e.preventDefault();
            loginManeger(e);
        }
    }
}
const printSetences = (token) => {
    window.location.href = "products.html"
}
const loginUser = (e) => {
    e.preventDefault();
    var requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "id": e.target['id'].value,
            "name": "string",
            "password": e.target['password'].value,
            "setenceIds": [
                0
            ]
        }),
        redirect: "follow",
    };
    fetch(uri, requestOptions)
        .then(response => {
            formLoginUser.style.display = 'none';
            if (response.status === 200)
                return response.text();
            else {
                alert("Unauthorized");
                throw new Error()
            }
        })
        .then(data => {
            localStorage.setItem('token', data);
            printSetences(data);
        }).catch(e => login())
}
const loginManeger = (e) => {
    e.preventDefault();
    var requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: e.target['password'].value }),
        redirect: "follow",
    };
    fetch('/Maneger/Login', requestOptions)
        .then(response => {
            formLoginManeger.style.display = 'none';
            if (response.status === 200)
                return response.text();
            else {
                alert("Unauthorized");
                throw new Error();
            }
        })
        .then(data => {
            localStorage.setItem('token', data);
            printSetences();
        }).catch(e => login())
}
start();