import Api from './Api'
import Web from './Web'
import Settings from './Settings'

const Controllers = {
    Api: Object.assign(Api, Api),
    Web: Object.assign(Web, Web),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers