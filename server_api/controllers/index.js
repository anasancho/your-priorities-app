let express = require('express');
let router = express.Router();
let log = require('../utils/logger');
let toJson = require('../utils/to_json');
let path = require('path');
let fs = require('fs');

let replaceForBetterReykjavik = function (data) {
  data = data.replace(/XappNameX/g, "Betri Reykjavík");
  data = data.replace(/XdescriptionX/g, "Betri Reykjavík er samráðsverkefni Reykjavíkurborgar, Íbúa ses og Reykvíkinga.");
  return data.replace(/XmanifestPathX/g, "manifest_br");
};

let replaceForBetterIceland = function (data) {
  data = data.replace(/XappNameX/g, "Betra Ísland");
  data = data.replace(/XdescriptionX/g, "Betra Ísland er samráðsvefur fyrir alla Íslendinga");
  return data.replace(/XmanifestPathX/g, "manifest_bi");
};

let replaceForYrpri = function (data) {
  data = data.replace(/XappNameX/g, "Your Priorities");
  data = data.replace(/XdescriptionX/g, "Citizen participation application");
  return data.replace(/XmanifestPathX/g, "manifest_yp");
};

let replaceForSmarterNJ = function (data) {
  data = data.replace(/XappNameX/g, "SmarterNJ");
  data = data.replace(/XdescriptionX/g, "SmarterNJ is an open government initiative that uses new and innovative technology to meaningfully engage New Jerseyans. Your participation in SmarterNJ will allow us to create policies, programs and services that are more effective, more efficient, and more impactful for all New Jerseyans.");
  return data.replace(/XmanifestPathX/g, "manifest_smarternj");
};

let replaceFromEnv = function (data) {
  data = data.replace(/XappNameX/g, process.env.YP_INDEX_APP_NAME ? process.env.YP_INDEX_APP_NAME : "Your Priorities");
  data = data.replace(/XdescriptionX/g, process.env.YP_INDEX_DESCRIPTION ? process.env.YP_INDEX_DESCRIPTION : "Citizen participation application");
  return data.replace(/XmanifestPathX/g, process.env.YP_INDEX_MANIFEST_PATH ? process.env.YP_INDEX_MANIFEST_PATH : "manifest_yp");
};

let sendIndex = function (req, res) {
  let indexFilePath;
  log.info('Index Viewed', { context: 'view', user: req.user ? toJson(req.user) : null });

  if (FORCE_PRODUCTION || process.env.NODE_ENV == 'production') {
    indexFilePath = path.resolve(__dirname, '../../client_app/build/bundled/index.html');
  } else {
    indexFilePath = path.resolve(__dirname, '../../client_app/index.html');
  }

  fs.readFile(indexFilePath, 'utf8', function(err, indexFileData) {
    if (err) {
      console.error("Cant read index file");
      throw err;
    } else {
      var userAgent = req.headers['user-agent'];
      var ie11 = /Trident/.test(userAgent);
      if (!ie11) {
        indexFileData = indexFileData.replace('<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE11">','');
      }

      if (req.hostname.indexOf('betrireykjavik.is') > -1) {
        res.send(replaceForBetterReykjavik(indexFileData));
      } else if (req.hostname.indexOf('betraisland.is') > -1) {
        res.send(replaceForBetterIceland(indexFileData));
      } else if (req.hostname.indexOf('smarter.nj.gov') > -1) {
        res.send(replaceForSmarterNJ(indexFileData));
      } else if (req.hostname.indexOf('yrpri.org') > -1) {
        res.send(replaceForYrpri(indexFileData));
      } else {
        res.send(replaceFromEnv(indexFileData));
      }
    }
  });
};

router.get('/', function(req, res) {
  sendIndex(req, res);
});

router.get('/domain*', function(req, res) {
  sendIndex(req, res);
});

router.get('/community*', function(req, res) {
  sendIndex(req, res);
});

router.get('/group*', function(req, res) {
  sendIndex(req, res);
});

router.get('/post*', function(req, res) {
  sendIndex(req, res);
});

router.get('/user*', function(req, res) {
  sendIndex(req, res);
});

module.exports = router;
