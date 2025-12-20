import UserController from './UserController'
import PointController from './PointController'
import UserPrizeController from './UserPrizeController'
import GachaController from './GachaController'
import PrizeController from './PrizeController'
import TradeController from './TradeController'
import StickerBookController from './StickerBookController'

const Api = {
    UserController: Object.assign(UserController, UserController),
    PointController: Object.assign(PointController, PointController),
    UserPrizeController: Object.assign(UserPrizeController, UserPrizeController),
    GachaController: Object.assign(GachaController, GachaController),
    PrizeController: Object.assign(PrizeController, PrizeController),
    TradeController: Object.assign(TradeController, TradeController),
    StickerBookController: Object.assign(StickerBookController, StickerBookController),
}

export default Api