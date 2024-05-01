function execute(url) {
    let chapId = url.split('|')[1];
    let browser = Engine.newBrowser();
    browser.launch(url.split('|')[0], 5000);
    browser.callJs("var authorization = window.localStorage.getItem('user'); var auth = document.createElement('auth'); auth.innerHTML = authorization; document.body.appendChild(auth);", 100);
    let auth = browser.html().select("auth").text();
    browser.close();
    if (auth) {
        let token = JSON.parse(auth).token;
        let response = fetch('https://bachngocsach.net.vn/api/chapter/'+chapId, {
            method: 'GET',
            headers: {
                authorization: 'Bearer ' + token,
            }
        });
        if (response.ok) {
            let data = response.json();
            if (data && data.chapter && data.chapter.content) {
                let content = data.chapter.content.replace(/<!-- (.*?) -->/gm, '')
                    .replace(/<p(.*?)>(.*?)<?p>/g, '')
                    .replace(/\n/g, '<br>');
                return Response.success(content);
            } else {
                return Response.error('Đây là chương mất tiền hoặc bạn chưa đăng nhập nick vào web bằng vbook. Đăng nhập rồi load lại nhé!');
            }
        }
    } else {
        let response = fetch('https://bachngocsach.net.vn/api/chapter/'+chapId);
        if (response.ok) {
            let data = response.json();
            if (!data || data.chapter.price > 0) {
                return Response.error('Đây là chương mất tiền hoặc bạn chưa đăng nhập nick vào web bằng vbook. Đăng nhập rồi load lại nhé!');
            } else {
                let content = data.chapter.content.replace(/<!-- (.*?) -->/gm, '')
                    .replace(/<p(.*?)>(.*?)<?p>/g, '')
                    .replace(/\n/g, '<br>');
                return Response.success(content);
            }
        }

    }
}