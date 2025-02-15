'use strict';

import '../themes/default/js/webfonts';
import 'jquery';
import angular from 'angular';
import angularDragula from 'angular-dragula';
import 'ng-file-upload';
import 'highcharts-ng';
import 'angular-ui-router';
import 'angular-material';
import 'angular-moment';
import 'angular-sanitize';
import angularSock from 'angular-sockjs';
import angularStomp from '../lib/stomp/ng-stomp.standalone.min';
import 'lib/angular-toArrayFilter/toArrayFilter';
import 'angular-translate';
import 'angular-translate-loader-partial';
import 'angular-websocket';
import '../components/animation/animationAuthoringComponentModule';
import AnnotationService from '../services/annotationService';
import '../components/audioOscillator/audioOscillatorAuthoringComponentModule';
import './components/authoringToolComponents';
import AuthoringToolController from './authoringToolController';
import AuthoringToolMainController from './main/authoringToolMainController';
import AuthoringToolNewProjectController from './main/authoringToolNewProjectController';
import AuthoringToolProjectService from './authoringToolProjectService';
import AuthorNotebookController from './notebook/authorNotebookController';
import '../components/conceptMap/conceptMapAuthoringComponentModule';
import ConfigService from '../services/configService';
import CRaterService from '../services/cRaterService';
import '../directives/components';
import ComponentService from '../components/componentService';
import '../components/discussion/discussionAuthoringComponentModule';
import '../components/draw/drawAuthoringComponentModule';
import '../components/embedded/embeddedAuthoringComponentModule';
import '../filters/filters';
import '../lib/highcharts@4.2.1';
import '../components/graph/graphAuthoringComponentModule';
import '../components/html/htmlAuthoringComponentModule';
import '../components/label/labelAuthoringComponentModule';
import '../components/match/matchAuthoringComponentModule';
import '../components/multipleChoice/multipleChoiceAuthoringComponentModule';
import NodeAuthoringController from './node/nodeAuthoringController';
import NodeService from '../services/nodeService';
import NotebookService from '../services/notebookService';
import NotificationService from '../services/notificationService';
import '../components/openResponse/openResponseAuthoringComponentModule';
import '../components/outsideURL/outsideURLAuthoringComponentModule';
import ProjectAssetController from './asset/projectAssetController';
import ProjectAssetService from '../services/projectAssetService';
import ProjectController from './project/projectController';
import ProjectHistoryController from './history/projectHistoryController';
import ProjectInfoController from './info/projectInfoController';
import PlanningService from '../services/planningService';
import ProjectService from '../services/projectService';
import SessionService from '../services/sessionService';
import SpaceService from '../services/spaceService';
import StudentAssetService from '../services/studentAssetService';
import StudentDataService from '../services/studentDataService';
import StudentStatusService from '../services/studentStatusService';
import StudentWebSocketService from '../services/studentWebSocketService';
import SummaryAuthoringComponentModule from '../components/summary/summaryAuthoringComponentModule';
import '../components/table/tableAuthoringComponentModule';
import TeacherDataService from '../services/teacherDataService';
import TeacherWebSocketService from '../services/teacherWebSocketService';
import UtilService from '../services/utilService';
import WISELinkAuthoringController from './wiseLink/wiseLinkAuthoringController';

import 'lib/angular-summernote/dist/angular-summernote.min';
import moment from 'moment';

const authoringModule = angular.module('authoring', [
    angularDragula(angular),
    'angularMoment',
    'angular-toArrayFilter',
    'summaryAuthoringComponentModule',
    'animationAuthoringComponentModule',
    'audioOscillatorAuthoringComponentModule',
    'authoringTool.components',
    'components',
    'conceptMapAuthoringComponentModule',
    'discussionAuthoringComponentModule',
    'drawAuthoringComponentModule',
    'embeddedAuthoringComponentModule',
    'filters',
    'graphAuthoringComponentModule',
    'highcharts-ng',
    'htmlComponentModule',
    'labelAuthoringComponentModule',
    'matchAuthoringComponentModule',
    'multipleChoiceAuthoringComponentModule',
    'ngAnimate',
    'ngAria',
    'ngFileUpload',
    'ngMaterial',
    'ngSanitize',
    'bd.sockjs',
    'ngStomp',
    'ngWebSocket',
    'openResponseAuthoringComponentModule',
    'outsideURLAuthoringComponentModule',
    'pascalprecht.translate',
    'summernote',
    'tableAuthoringComponentModule',
    'ui.router'
    ])
    .service(AnnotationService.name, AnnotationService)
    .service(ComponentService.name, ComponentService)
    .service(ConfigService.name, ConfigService)
    .service(CRaterService.name, CRaterService)
    .service(NodeService.name, NodeService)
    .service(NotebookService.name, NotebookService)
    .service(NotificationService.name, NotificationService)
    .service(PlanningService.name, PlanningService)
    .service(ProjectService.name, AuthoringToolProjectService)
    .service(ProjectAssetService.name, ProjectAssetService)
    .service(SessionService.name, SessionService)
    .service(SpaceService.name, SpaceService)
    .service(StudentAssetService.name, StudentAssetService)
    .service(StudentDataService.name, StudentDataService)
    .service(StudentStatusService.name, StudentStatusService)
    .service(StudentWebSocketService.name, StudentWebSocketService)
    .service(TeacherDataService.name, TeacherDataService)
    .service(TeacherWebSocketService.name, TeacherWebSocketService)
    .service(UtilService.name, UtilService)
    .controller(AuthoringToolController.name, AuthoringToolController)
    .controller(AuthoringToolMainController.name, AuthoringToolMainController)
    .controller(AuthoringToolNewProjectController.name, AuthoringToolNewProjectController)
    .controller(AuthorNotebookController.name, AuthorNotebookController)
    .controller(NodeAuthoringController.name, NodeAuthoringController)
    .controller(ProjectAssetController.name, ProjectAssetController)
    .controller(ProjectController.name, ProjectController)
    .controller(ProjectHistoryController.name, ProjectHistoryController)
    .controller(ProjectInfoController.name, ProjectInfoController)
    .controller(WISELinkAuthoringController.name, WISELinkAuthoringController)
    .config([
    '$urlRouterProvider',
    '$stateProvider',
    '$translateProvider',
    '$translatePartialLoaderProvider',
    '$controllerProvider',
    '$mdThemingProvider',
    ($urlRouterProvider,
     $stateProvider,
     $translateProvider,
     $translatePartialLoaderProvider,
     $controllerProvider,
     $mdThemingProvider) => {

      $urlRouterProvider.otherwise('/');

      $stateProvider
          .state('root', {
            url: '',
            abstract: true,
            templateUrl: 'wise5/authoringTool/authoringTool.html',
            controller: 'AuthoringToolController',
            controllerAs: 'authoringToolController',
            resolve: {}
          })
          .state('root.main', {
            url: '/',
            templateUrl: 'wise5/authoringTool/main/main.html',
            controller: 'AuthoringToolMainController',
            controllerAs: 'authoringToolMainController',
            resolve: {
              config: (ConfigService) => {
                return ConfigService.retrieveConfig(window.configURL);
              },
              language: ($translate, ConfigService, config) => {
                $translate.use(ConfigService.getLocale());
              }
            }
          })
          .state('root.new', {
            url: '/new',
            templateUrl: 'wise5/authoringTool/main/new.html',
            controller: 'AuthoringToolNewProjectController',
            controllerAs: 'authoringToolNewProjectController',
            resolve: {
              config: (ConfigService) => {
                return ConfigService.retrieveConfig(window.configURL);
              },
              language: ($translate, ConfigService, config) => {
                $translate.use(ConfigService.getLocale());
              }
            }
          })
          .state('root.project', {
            url: '/project/:projectId',
            templateUrl: 'wise5/authoringTool/project/project.html',
            controller: 'ProjectController',
            controllerAs: 'projectController',
            resolve: {
              projectConfig: (ConfigService, $stateParams) => {
                const configURL = window.configURL + '/' + $stateParams.projectId;
                return ConfigService.retrieveConfig(configURL);
              },
              project: (ProjectService, projectConfig) => {
                return ProjectService.retrieveProject();
              },
              projectAssets: (ProjectAssetService, projectConfig, project) => {
                return ProjectAssetService.retrieveProjectAssets();
              },
              language: ($translate, ConfigService, projectConfig) => {
                $translate.use(ConfigService.getLocale());
              }
            }
          })
          .state('root.project.node', {
            url: '/node/:nodeId',
            templateUrl: 'wise5/authoringTool/node/node.html',
            controller: 'NodeAuthoringController',
            controllerAs: 'nodeAuthoringController',
            resolve: {}
          })
          .state('root.project.nodeConstraints', {
            url: '/node/constraints/:nodeId',
            templateUrl: 'wise5/authoringTool/node/node.html',
            controller: 'NodeAuthoringController',
            controllerAs: 'nodeAuthoringController',
            resolve: {}
          })
          .state('root.project.nodeEditPaths', {
            url: '/node/editpaths/:nodeId',
            templateUrl: 'wise5/authoringTool/node/node.html',
            controller: 'NodeAuthoringController',
            controllerAs: 'nodeAuthoringController',
            resolve: {}
          })
          .state('root.project.asset', {
            url: '/asset',
            templateUrl: 'wise5/authoringTool/asset/asset.html',
            controller: 'ProjectAssetController',
            controllerAs: 'projectAssetController',
            resolve: {}
          })
          .state('root.project.info', {
            url: '/info',
            templateUrl: 'wise5/authoringTool/info/info.html',
            controller: 'ProjectInfoController',
            controllerAs: 'projectInfoController',
            resolve: {}
          })
          .state('root.project.history', {
            url: '/history',
            templateUrl: 'wise5/authoringTool/history/history.html',
            controller: 'ProjectHistoryController',
            controllerAs: 'projectHistoryController',
            resolve: {}
          })
          .state('root.project.notebook', {
            url: '/notebook',
            templateUrl: 'wise5/authoringTool/notebook/notebookAuthoring.html',
            controller: 'AuthorNotebookController',
            controllerAs: 'authorNotebookController',
            resolve: {}
          });

      $translatePartialLoaderProvider.addPart('i18n');
      $translatePartialLoaderProvider.addPart('authoringTool/i18n');
      $translateProvider
          .useLoader('$translatePartialLoader', {
            urlTemplate: 'wise5/{part}/i18n_{lang}.json'
          })
          .registerAvailableLanguageKeys(
            ['ar','el','en','es','ja','ko','pt','tr','zh_CN','zh_TW'], {
            'en_US': 'en',
            'en_UK': 'en'
          })
          .determinePreferredLanguage()
          .fallbackLanguage(['en'])
          .useSanitizeValueStrategy('sanitizeParameters', 'escape');

      $mdThemingProvider.definePalette('accent', {
        '50': 'fde9e6',
        '100': 'fbcbc4',
        '200': 'f8aca1',
        '300': 'f4897b',
        '400': 'f2705f',
        '500': 'f05843',
        '600': 'da503c',
        '700': 'c34736',
        '800': 'aa3e2f',
        '900': '7d2e23',
        'A100': 'ff897d',
        'A200': 'ff7061',
        'A400': 'ff3829',
        'A700': 'cc1705',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50', '100', '200', '300', 'A100'],
        'contrastLightColors': undefined
      });
      $mdThemingProvider.theme('default')
          .primaryPalette('deep-purple', { 'default': '400' })
          .accentPalette('accent',  { 'default': '500' })
          .warnPalette('red', { 'default': '800' });
      const lightMap = $mdThemingProvider.extendPalette('grey', {
      'A100': 'ffffff'
      });
      $mdThemingProvider.definePalette('light', lightMap);
      $mdThemingProvider.theme('light')
          .primaryPalette('light', { 'default': 'A100' })
          .accentPalette('pink', { 'default': '900' });
      $mdThemingProvider.setDefaultTheme('default');
      $mdThemingProvider.enableBrowserColor();

      // moment.js default overrides
      // TODO: add i18n support
      moment.updateLocale('en', {
        calendar: {
          lastDay : '[Yesterday at] LT',
          sameDay : '[Today at] LT',
          nextDay : '[Tomorrow at] LT',
          lastWeek : '[last] dddd [at] LT',
          nextWeek : 'dddd [at] LT',
          sameElse : 'll'
        }
      });
    }
]);

export default authoringModule;
