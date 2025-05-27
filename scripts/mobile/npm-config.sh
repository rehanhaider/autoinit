#!/bin/bash


npm init -y
npm pkg set name=mobile version=0.1.0
npm pkg delete description main keywords author license type
npm pkg set main='expo-router/entry'
npm pkg set scripts.start='expo start' scripts.android='expo run:android' scripts.ios='expo run:ios' scripts.web='expo start --web'
npm pkg set scripts.reset-project='node ./scripts/reset-project.js' scripts.test='jest --watchAll' scripts.lint='expo lint'
npm pkg set jest.preset='jest-expo'

npm install --save @react-native-async-storage/async-storage @react-navigation/bottom-tabs @react-navigation/native
npm install --save expo expo-blur expo-constants expo-font expo-haptics expo-image expo-linking @expo/vector-icons
npm install --save expo-router expo-splash-screen expo-status-bar expo-symbols expo-system-ui expo-web-browser
npm install --save react react-dom react-native react-native-gesture-handler react-native-reanimated react-native-safe-area-context
npm install --save react-native-screens react-native-web react-native-webview

npm install --save-dev @babel/core @types/react typescript eslint eslint-config-expo prettier