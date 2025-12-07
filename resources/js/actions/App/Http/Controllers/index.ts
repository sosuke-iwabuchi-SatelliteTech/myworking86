import UserController from './UserController'
import UserPrizeController from './UserPrizeController'
import GachaController from './GachaController'
import PointController from './PointController'
import Settings from './Settings'

const Controllers = {
    UserController: Object.assign(UserController, UserController),
    UserPrizeController: Object.assign(UserPrizeController, UserPrizeController),
    GachaController: Object.assign(GachaController, GachaController),
    PointController: Object.assign(PointController, PointController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers