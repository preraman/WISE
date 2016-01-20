'use strict';

class navItemDirective {
    constructor() {
        this.scope = {
            nodeId: '=',
            showPosition: '=',
            type: '='
        };
        this.template = '<ng-include src="navitemCtrl.getTemplateUrl()"></ng-include>';
        this.controller = 'NavItemController';
        this.controllerAs = 'navitemCtrl';
        this.bindToController = true;
    }

    static directiveFactory() {
        navItemDirective.instance = new navItemDirective();
        return navItemDirective.instance;
    }
}

class NavItemController {
    constructor($scope,
                $element,
                ProjectService,
                StudentDataService) {

        this.$scope = $scope;
        this.$element = $element;
        this.ProjectService = ProjectService;
        this.StudentDataService = StudentDataService;

        this.expanded = false;

        this.item = this.ProjectService.idToNode[this.nodeId];
        this.isGroup = this.ProjectService.isGroupNode(this.nodeId);
        this.nodeStatuses = this.StudentDataService.nodeStatuses;
        this.nodeStatus = this.nodeStatuses[this.nodeId];

        this.nodeTitle = this.showPosition ? (this.ProjectService.idToPosition[this.nodeId] + ': ' + this.item.title) : this.item.title;
        this.currentNode = this.StudentDataService.currentNode;
        var isCurrentNode = (this.currentNode.id === this.nodeId);
        var setNewNode = false;

        var scope = this;

        this.$scope.$watch(
            function () { return this.StudentDataService.currentNode; },
            function (newNode) {
                scope.currentNode = newNode;
                if (this.StudentDataService.previousStep) {
                    this.$scope.$parent.isPrevStep = (scope.nodeId === this.StudentDataService.previousStep.id);
                }
                isCurrentNode = (scope.currentNode.id === scope.nodeId);
                if (isCurrentNode || this.ProjectService.isApplicationNode(newNode.id) || newNode.id === this.ProjectService.rootNode.id) {
                    setExpanded();
                }
            }
        );

        this.$scope.$watch(
            function () { return scope.expanded; },
            function (value) {
                this.$scope.$parent.itemExpanded = value;
                if (value) {
                    zoomToElement();
                }
            }
        );

        setExpanded();
    }

    getTemplateUrl(){
        return this.ProjectService.getThemePath() + '/navigation/navItem.html';
    };

    setExpanded() {
        scope.expanded = (isCurrentNode || (scope.isGroup && this.ProjectService.isNodeDescendentOfGroup(scope.currentNode, scope.item)));
        if (scope.expanded && isCurrentNode) {
            zoomToElement();
        }
    };

    zoomToElement() {
        setTimeout(function () {
            // smooth scroll to expanded group's page location
            var location = this.$element[0].offsetTop - 32;
            $('#content').animate({
                scrollTop: location
            }, 350, 'linear', function () {
                if (setNewNode) {
                    setNewNode = false;
                    this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(scope.nodeId);
                }
            });
        }, 250);
    };

    itemClicked() {
        if (this.isGroup) {
            if (!this.expanded) {
                setNewNode = true;
            }
            this.expanded = !this.expanded;
        } else {
            this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(this.nodeId);
        }
    };
}

class stepToolsDirective {
    constructor() {
        this.scope = {
            nodeId: '=',
            showPosition: '='
        };
        this.template = '<ng-include src="stepToolsCtrl.getTemplateUrl()"></ng-include>';
        this.controller = 'StepToolsCtrl';
        this.controllerAs = 'stepToolsCtrl';
        this.bindToController = true;
    }

    static directiveFactory() {
        stepToolsDirective.instance = new stepToolsDirective();
        return stepToolsDirective.instance;
    }
}

class StepToolsCtrl {
    constructor($scope,
                NodeService,
                ProjectService,
                StudentDataService) {

        this.$scope = $scope;
        this.NodeService = NodeService;
        this.ProjectService = ProjectService;
        this.StudentDataService = StudentDataService;

        this.nodeStatuses = this.StudentDataService.nodeStatuses;
        this.nodeStatus = this.nodeStatuses[this.nodeId];

        this.prevId = this.NodeService.getPrevNodeId();
        this.nextId = this.NodeService.getNextNodeId();

        // service objects and utility functions
        this.idToOrder = this.ProjectService.idToOrder;

        // model variable for selected node id
        this.toNodeId = this.nodeId;

        var scope = this;
        this.$scope.$watch(
            function () { return scope.toNodeId; },
            function (newId, oldId) {
                if (newId !== oldId) {
                    // selected node id has changed, so open new node
                    this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(newId);
                }
            }
        );
    }

    getTemplateUrl(){
        return this.ProjectService.getThemePath() + '/node/stepTools.html';
    };

    getNodeTitleByNodeId(nodeId) {
        return this.ProjectService.getNodeTitleByNodeId(nodeId);
    };

    getNodePositionById(nodeId) {
        return this.ProjectService.getNodePositionById(nodeId);
    };

    isGroupNode(nodeId) {
        return this.ProjectService.isGroupNode(nodeId);
    };

    goToPrevNode() {
        this.NodeService.goToPrevNode();
    };

    goToNextNode() {
        this.NodeService.goToNextNode();
    };

    closeNode() {
        this.NodeService.closeNode();
    };
}

class nodeStatusIconDirective {
    constructor() {
        this.scope = {
            nodeId: '=',
            customClass: '='
        };
        this.template = '<ng-include src="nodeStatusIconCtrl.getTemplateUrl()"></ng-include>';
        this.controller = 'NodeStatusIconCtrl';
        this.controllerAs = 'nodeStatusIconCtrl';
        this.bindToController = true;
    }

    static directiveFactory() {
        nodeStatusIconDirective.instance = new nodeStatusIconDirective();
        return nodeStatusIconDirective.instance;
    }
}

class NodeStatusIconCtrl {
    constructor($scope,
                ProjectService,
                StudentDataService) {

        this.$scope = $scope;
        this.ProjectService = ProjectService;
        this.StudentDataService = StudentDataService;

        this.nodeStatuses = this.StudentDataService.nodeStatuses;
        this.nodeStatus = this.nodeStatuses[this.nodeId];
    }

    getTemplateUrl(){
        return this.ProjectService.getThemePath() + '/templates/nodeStatusIcon.html';
    }
}

class ThemeController {
    constructor($scope,
                ConfigService,
                ProjectService,
                StudentDataService,
                NotebookService,
                SessionService,
                $mdDialog,
                $mdToast,
                $mdComponentRegistry) {

        this.$scope = $scope;
        this.ConfigService = ConfigService;
        this.ProjectService = ProjectService;
        this.StudentDataService = StudentDataService;
        this.NotebookService = NotebookService;
        this.SessionService = SessionService;
        this.$mdDialog = $mdDialog;
        this.$mdToast = $mdToast;
        this.$mdComponentRegistry = $mdComponentRegistry;

        // TODO: set these variables dynamically from theme settings
        this.layoutView = 'list'; // 'list' or 'card'
        this.numberProject = true;

        this.themePath = this.ProjectService.getThemePath();

        this.nodeStatuses = this.StudentDataService.nodeStatuses;

        this.rootNode = this.ProjectService.rootNode;
        this.rootNodeStatus = this.nodeStatuses[this.rootNode.id];

        this.workgroupId = this.ConfigService.getWorkgroupId();
        this.workgroupUserNames = this.isPreview ? ['Preview User'] : this.ConfigService.getUserNamesByWorkgroupId(this.workgroupId);

        // build project status pop-up
        var statusTemplateUrl = this.themePath + '/templates/projectStatus.html';
        var scope = this;
        this.statusDisplay = this.$mdToast.build({
            locals: {
                projectStatus: scope.rootNodeStatus,
                userNames: scope.workgroupUserNames
            },
            controller: 'ProjectStatusController',
            bindToController: true,
            templateUrl: statusTemplateUrl,
            hideDelay: 0
        });

        this.projectStatusOpen = false;
        this.showProjectStatus = function($event) {
            if (this.projectStatusOpen) {
                this.$mdToast.hide(this.statusDisplay);
                this.projectStatusOpen = false;
            } else {
                this.$mdToast.show(this.statusDisplay);
                this.projectStatusOpen = true;
            }
        };

        // alert user when a locked node has been clicked
        this.$scope.$on('nodeClickLocked', angular.bind(this, function (event, args) {
            var nodeId = args.nodeId;

            // TODO: customize alert with constraint details, correct node term
            this.$mdDialog.show(
                this.$mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Item Locked')
                    .content('Sorry, you cannot view this item yet.')
                    .ariaLabel('Item Locked')
                    .clickOutsideToClose(true)
                    .ok('OK')
                    .targetEvent(event)
            );
        }));

        // alert user when inactive for a long time
        this.$scope.$on('showSessionWarning', angular.bind(this, function() {
            var confirm = this.$mdDialog.confirm()
                .parent(angular.element(document.body))
                .title('Session Timeout')
                .content('You have been inactive for a long time. Do you want to stay logged in?')
                .ariaLabel('Session Timeout')
                .ok('YES')
                .cancel('No');
            this.$mdDialog.show(confirm).then(function() {
                this.SessionService.renewSession();
            }, function() {
                this.SessionService.forceLogOut();
            });
        }));

        // alert user when attempt to add component state to notebook that already exists in notebook
        this.$scope.$on('notebookAddDuplicateAttempt', angular.bind(this, function (event, args) {
            this.$mdDialog.show(
                this.$mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Item already exists in Notebook')
                    .content('You can add another version of the item by making changes and then adding it again.')
                    .ariaLabel('Notebook Duplicate')
                    .clickOutsideToClose(true)
                    .ok('OK')
                    .targetEvent(event)
            );
        }));

        // show list of revisions in a dialog when user clicks the show revisions link for a component
        this.$scope.$on('showRevisions', angular.bind(this, function (event, args) {
            var revisions = args.revisions;
            var componentController = args.componentController;
            var allowRevert = args.allowRevert;
            var $event = args.$event;
            var revisionsTemplateUrl = scope.themePath + '/templates/componentRevisions.html';

            this.$mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: $event,
                templateUrl: revisionsTemplateUrl,
                locals: {
                    items: revisions.reverse(),
                    componentController: componentController,
                    allowRevert: allowRevert
                },
                controller: RevisionsController
            });
            function RevisionsController($scope, $mdDialog, items, componentController, allowRevert) {
                $scope.items = items;
                $scope.componentController = componentController;
                $scope.allowRevert = allowRevert;
                $scope.close = function() {
                    $mdDialog.hide();
                };
                $scope.revertWork = function(componentState) {
                    $scope.componentController.setStudentWork(componentState);
                    $scope.componentController.studentDataChanged();
                    $mdDialog.hide();
                };
            }
        }));

        this.$scope.$on('showNotebook', angular.bind(this, function (event, args) {
            var notebookFilters = args.notebookFilters;
            var componentController = args.componentController;
            var $event = args.$event;
            var notebookDialogTemplateUrl = scope.themePath + '/templates/notebookDialog.html';
            var notebookTemplateUrl = scope.themePath + '/notebook/notebook.html';

            this.$mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: $event,
                templateUrl: notebookDialogTemplateUrl,
                locals: {
                    notebookFilters: notebookFilters,
                    notebookTemplateUrl: notebookTemplateUrl,
                    componentController: componentController
                },
                controller: NotebookDialogController
            });
            function NotebookDialogController($scope, $mdDialog, componentController) {
                $scope.notebookFilters = notebookFilters;
                $scope.notebookFilter = notebookFilters[0].name;
                $scope.notebookTemplateUrl = notebookTemplateUrl;
                $scope.componentController = componentController;
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                }
            }
        }));

        // capture notebook open/close events
        this.$mdComponentRegistry.when('notebook').then(function(it){
            this.$scope.$watch(function() {
                return it.isOpen();
            }, function(isOpenNewValue, isOpenOldValue) {
                if (isOpenNewValue !== isOpenOldValue) {
                    var currentNode = this.StudentDataService.getCurrentNode();
                    this.NotebookService.saveNotebookToggleEvent(isOpenNewValue, currentNode);
                }
            });
        });
    }
}

class ProjectStatusController {
    constructor($scope,
                projectStatus,
                userNames) {

        this.$scope = $scope;
        this.projectStatus = projectStatus;
        this.userNames = userNames;

        $scope.projectStatus = projectStatus;
        $scope.userNames = userNames;
    }
}

let Directives = angular.module('directives', []);

navItemDirective.directiveFactory.$inject = [];
stepToolsDirective.directiveFactory.$inject = [];
nodeStatusIconDirective.directiveFactory.$inject = [];

Directives.directive('navItem', navItemDirective.directiveFactory);
Directives.directive('stepTools', stepToolsDirective.directiveFactory);
Directives.directive('nodeStatusIcon', nodeStatusIconDirective.directiveFactory);

NavItemController.$inject = [
    '$scope',
    '$element',
    'ProjectService',
    'StudentDataService'
];

StepToolsCtrl.$inject = [
    '$scope',
    'NodeService',
    'ProjectService',
    'StudentDataService'
];

NodeStatusIconCtrl.$inject = [
    '$scope',
    'ProjectService',
    'StudentDataService'
];

ProjectStatusController.$inject = [
    '$scope',
    'projectStatus',
    'userNames'
];

ThemeController.$inject = [
    '$scope',
    'ConfigService',
    'ProjectService',
    'StudentDataService',
    'NotebookService',
    'SessionService',
    '$mdDialog',
    '$mdToast',
    '$mdComponentRegistry'
];

/*
angular.module('vle').controller('NavItemController', new NavItemController($scope, $element, ProjectService, StudentDataService));
angular.module('vle').controller('StepToolsCtrl', new StepToolsCtrl());
angular.module('vle').controller('NodeStatusIconCtrl', new NodeStatusIconCtrl());
angular.module('vle').controller('ProjectStatusController', new ProjectStatusController());
angular.module('vle').controller('ThemeController', new ThemeController());
*/

angular.module('vle').controller('NavItemController', NavItemController);
angular.module('vle').controller('StepToolsCtrl', StepToolsCtrl);
angular.module('vle').controller('NodeStatusIconCtrl', NodeStatusIconCtrl);
angular.module('vle').controller('ProjectStatusController', ProjectStatusController);
angular.module('vle').controller('ThemeController', ThemeController);