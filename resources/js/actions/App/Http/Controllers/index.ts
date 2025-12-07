import UserController from './UserController'
import UserPrizeController from './UserPrizeController'
import PointController from './PointController'
import Admin from './Admin'
import Settings from './Settings'

const Controllers = {
    UserController: Object.assign(UserController, UserController),
    UserPrizeController: Object.assign(UserPrizeController, UserPrizeController),
    PointController: Object.assign(PointController, PointController),
    Admin: Object.assign(Admin, Admin),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers