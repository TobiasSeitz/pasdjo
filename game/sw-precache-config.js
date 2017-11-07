/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
module.exports = {
  version: 20,
  staticFileGlobs: [
    '/index.html',
    '/src/**/*',
    '/manifest.json',
    '/bower_components/polymer/polymer.html',
    '/bower_components/app-layout/app-drawer/app-drawer.html',
    '/bower_components/app-layout/app-drawer-layout/app-drawer-layout.html',
    '/bower_components/app-layout/app-header/app-header.html',
    '/bower_components/app-layout/app-scroll-effects/app-scroll-effects.html',
    '/bower_components/app-layout/app-toolbar/app-toolbar.html',
    '/bower_components/app-route/app-location.html',
    '/bower_components/app-route/app-route.html',
    '/bower_components/iron-ajax/iron-ajax.html',
    '/bower_components/iron-a11y-keys/iron-a11y-keys.html',
    '/bower_components/iron-icons/av-icons.html',
    '/bower_components/iron-icon/iron-icon.html',
    '/bower_components/iron-icons/iron-icons.html',
    '/bower_components/iron-list/iron-list.html',
    '/bower_components/iron-media-query/iron-media-query.html',
    '/bower_components/iron-pages/iron-pages.html',
    '/bower_components/iron-selector/iron-selector.html',
    '/bower_components/paper-button/paper-button.html',
    '/bower_components/paper-icon-button/paper-icon-button.html',
    '/bower_components/paper-icon-button/paper-icon-button-light.html',
    '/bower_components/paper-input/paper-input.html',
    '/bower_components/paper-toast/paper-toast.html',
    '/bower_components/polymerfire/polymerfire.html',
    '/bower_components/flip-clock/flip-clock.html',
    '/bower_components/app-localize-behavior/app-localize-behavior.html',
    '/images/**/*.{png,jpg,gif}'
  ],
  runtimeCaching: [
    {
      urlPattern: /\/src\/(.*)/,
      handler: 'networkFirst'
    },
    {
      urlPattern: /\/__\/(.*)/,
      handler: 'networkOnly'
    }
  ]
};
