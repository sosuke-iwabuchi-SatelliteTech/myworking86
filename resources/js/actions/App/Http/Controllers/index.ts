import UserController from './UserController'
import UserPrizeController from './UserPrizeController'
import Settings from './Settings'

const Controllers = {
    UserController: Object.assign(UserController, UserController),
    UserPrizeController: Object.assign(UserPrizeController, UserPrizeController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers