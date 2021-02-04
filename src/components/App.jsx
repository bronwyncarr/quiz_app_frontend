import { Switch, Route } from "react-router-dom";
import { useReducer } from "react";
import NewUser from "./NewUser";
import NewSession from "./NewSession";
import Location from "./Location/Location";
import Locations from "./Locations";
import NewLocation from "./Location/NewLocation";
import Favourites from "./Favourites";
import EditLocation from "./Location/EditLocation";
import SignOut from "./Signout";
import { Layout, Content } from "../styles/Layout";
import reducer from "../utils/reducer";
import { StateContext } from "../utils/context";
import SideBar from "./SideBar";
import { ProtectedRoute } from "./ProtectedRoute";
import NotFound from "./NotFound";

function App() {
  const initialState = {
    loggedInUser: true,
    staticAssets: {},
    loggedInAdmin: false,
    // auth: { token: null },
  };

  // Sets initial state (default values) to global state
  const [store, dispatch] = useReducer(reducer, initialState);
  return (
    <Layout>
      <StateContext.Provider value={{ store, dispatch }}>
        <SideBar />
        <Content>
          <Switch>
            <Route exact path={["/", "/locations"]} component={Locations} />
            <ProtectedRoute exact path="/favourites" component={Favourites} />
            <ProtectedRoute
              exact
              path="/locations/new"
              component={NewLocation}
            />
            <ProtectedRoute exact path="/locations/:id" component={Location} />
            <ProtectedRoute
              exact
              path="/locations/:id/edit"
              component={EditLocation}
            />
            <Route exact path="/sign_up" component={NewUser} />
            <Route exact path="/sign_in" component={NewSession} />
            <Route exact path="/sign_out" component={SignOut} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Content>
      </StateContext.Provider>
    </Layout>
  );
}

export default App;
