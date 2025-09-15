/**
 * useAppNavigation - Custom hook to simplify navigation actions in React Navigation.
 *
 * Usage Example:
 *
 * import { useAppNavigation } from '../hooks/useAppNavigation';
 *
 * const MyComponent = () => {
 *   const { goBack, push, navigate } = useAppNavigation();
 *
 *   // goBack();
 *   // push('ScreenName', { param1: 'value' });
 *   // navigate('ScreenName', { param1: 'value' });
 * };
 */
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamListBase } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

// Custom hook for navigation actions
type Navigation = StackNavigationProp<ParamListBase>;

export const useAppNavigation = () => {
  const navigation = useNavigation<Navigation>();

  /**
   * Go back to the previous screen in the navigation stack.
   * @returns {void}
   */
  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  /**
   * Push a new screen onto the navigation stack.
   * @param {string} name - The name of the screen to push.
   * @param {object} [params] - Optional parameters to pass to the screen.
   * @returns {void}
   */
  const push = useCallback(
    (name: string, params?: object) => navigation.push(name, params),
    [navigation]
  );

  /**
   * Navigate to a screen, optionally with parameters.
   * @param {string} name - The name of the screen to navigate to.
   * @param {object} [params] - Optional parameters to pass to the screen.
   * @returns {void}
   */
  const navigate = useCallback(
    (name: string, params?: object) => navigation.navigate(name, params),
    [navigation]
  );

  /**
   * Replace the current screen with a new screen.
   * @param {string} name - The name of the screen to replace with.
   * @param {object} [params] - Optional parameters to pass to the screen.
   * @returns {void}
   */
  const replace = useCallback(
    (name: string, params?: object) => navigation.replace(name, params),
    [navigation]
  );

  return useMemo(
    () => ({
      goBack,
      push,
      navigate,
      replace,
      navigation,
    }),
    [goBack, push, navigate, replace, navigation]
  );
};
