const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");

//Server

const replaceTemplate = (temp, sport) => {
  let output = temp.replace(/{%SPORTNAME%}/g, sport.sportName);
  output = output.replace(/{%IMAGE%}/g, sport.image);
  output = output.replace(/{%FAMOUSPLAYER%}/g, sport.famousPlayer);
  output = output.replace(/{%RULES%}/g, sport.rules);
  output = output.replace(/{%FUNFACT%}/g, sport.funFact);
  output = output.replace(/{%DESCRIPTION%}/g, sport.description);
  output = output.replace(/{%ID%}/g, sport.id);

  return output;
};
const data = fs.readFileSync("./api-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.sportName, { lower: true }));

const tempList = fs.readFileSync("./templates/template-list.html", "utf-8");
const tempInfo = fs.readFileSync("./templates/template-info.html", "utf-8");
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/list") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el));
    const output = tempList.replace("{%SPORTS_CARDS%}", cardsHtml);

    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else if (pathname === "/sport") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const sport = dataObj[query.id];
    const output = replaceTemplate(tempInfo, sport);
    res.end(output);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening on port 8000");
});
