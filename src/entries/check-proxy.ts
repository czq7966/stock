import * as Modules from '../modules'
import * as Services from '../services'
Modules.Database.database.proxys.setValids({});
Services.Database.Proxys.checkValids(Modules.Database.database.proxys, 200)
