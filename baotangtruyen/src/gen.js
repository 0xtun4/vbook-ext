function execute(url, page) {
    if (!page) page = '1';
    const doc = fetch('https://baotangtruyen10.com/home',{
        method : "GET",
        queries : {
            page : page,
            typegroup : url
        }
    }).html()
    var el = doc.select('#ctl00_divCenter .item')
    var next = doc.select('.pagination li.active + li').text()
    var data =[]
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
            name: e.select("h3 a").first().text(),
            link: e.select("h3 a").first().attr("href"),
            cover: e.select(".image img").first().attr("src"),
            description: e.select(".chapter a").first().text(),
            host: "https://baotangtruyen10.com"
        })
    }
    return Response.success(data,next)
}