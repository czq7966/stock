"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Modules = require("../modules");
var Services = require("../services");
Modules.Database.database.proxys.setValids({});
Services.Database.Proxys.checkValids(Modules.Database.database.proxys, 200);
