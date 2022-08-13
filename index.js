const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const serveIndex = require("serve-index");

const WebTorrent = require("webtorrent");

const client = new WebTorrent();

const magnetURI =
  "magnet:?xt=urn:btih:D5C633AED4C3FE873A7CDB43C1BBA38614FB68A4&dn=Morbius%20(2022)%20%5B1080p%5D%20%5BWEBRip%5D&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2710%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2780%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2730%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=http%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce";

const add = (url) => {
  client.add(url, { path: "public/downloads" }, function (torrent) {
    torrent.on("done", function () {
      console.log("torrent download finished");
    });
  });
};

// Human readable bytes util
function prettyBytes(num) {
  const units = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const neg = num < 0;
  if (neg) num = -num;
  if (num < 1) return (neg ? "-" : "") + num + " B";
  const exponent = Math.min(
    Math.floor(Math.log(num) / Math.log(1000)),
    units.length - 1
  );
  const unit = units[exponent];
  num = Number((num / Math.pow(1000, exponent)).toFixed(2));
  return (neg ? "-" : "") + num + " " + unit;
}

app.use(express.json());

app.get("/stat", (req, res) => {
  const percent = (client.progress * 100).toFixed(2) + "%";
  const downloadSpeed = prettyBytes(client.downloadSpeed) + "/s";
  const uploadSpeed = prettyBytes(client.uploadSpeed) + "/s";
  res.json({
    p: percent,
    ds: downloadSpeed,
    us: uploadSpeed,
  });
});

app.post("/add", (req, res) => {
  const url = req.body.url;

  console.log(" - Add", url);

  res.json({
    msg: "= 3= Add to q",
  });

  add(url);
});

app.use("/", express.static(path.resolve(__dirname, "public")));
app.use("/downloads", serveIndex(path.resolve(__dirname, "public/downloads")));

app.listen(8080, () => {
  console.log("Server start at 8080");
});
