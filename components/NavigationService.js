import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function reset(index, screens) {
    var actions = [];
    for (var i = 0; i < screens.length; i++) {
        actions.push(
            NavigationActions.navigate({routeName: screens[i]})
        )
    }
    _navigator.dispatch(
        NavigationActions.reset({
            index: index,
            actions: actions
        })
    );
  }

export default {
  navigate,
  setTopLevelNavigator,
  reset
};