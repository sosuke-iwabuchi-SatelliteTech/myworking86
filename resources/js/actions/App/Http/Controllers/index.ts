import UserController from './UserController'
import UserPrizeController from './UserPrizeController'
import GachaController from './GachaController'
import PointController from './PointController'
import Admin from './Admin'
import Settings from './Settings'

const Controllers = {
    UserController: Object.assign(UserController, UserController),
    UserPrizeController: Object.assign(UserPrizeController, UserPrizeController),
    GachaController: Object.assign(GachaController, GachaController),
    PointController: Object.assign(PointController, PointController),
    Admin: Object.assign(Admin, Admin),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers