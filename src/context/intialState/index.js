
import { initialState as initialStateRoom } from "../reducers/room";
import { initialState as initialStateUser } from "../reducers/user";

const initialContextState = {
    rooms: initialStateRoom,
    users: initialStateUser
}

export default initialContextState;