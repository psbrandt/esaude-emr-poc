'use strict';

angular.module('application')
    .factory('formStatesAutoGen', [function () {

        var gen = function (data, _$state_, $stateProviderRef) {
            _.forEach(data.getClinicalServices(), function (service) {
                    var formLayout = _.find(data.getFormLayout(), function (layout) {
                        return service.id === layout.id;
                    });
                    //create main state
                    if (!_$state_.get(formLayout.sufix)) {
                        var state = {
                            url: service.url + "/:patientUuid/:formId",
                            views: {},
                            resolve: { initialization: 'initialization' }
                        };
                        state.views["layout"] = {
                            templateUrl: '../common/application/views/layout.html', 
                            controller: 'FormController'
                        },
                        state.views["content@" + formLayout.sufix] = {templateUrl: '../service-form/views/form-add.html'};
                        $stateProviderRef.state(formLayout.sufix, state);
                    }
                    //create inner states
                    _.forEach(formLayout.parts, function (part) {
                        if (!_$state_.get(formLayout.sufix + part.sref)) {
                            var innerState = {
                                url: part.sref.replace('.','/'),
                                templateUrl: '../poc-common/form-display/views/form-part-input-template.html',
                                resolve: { initialization: 'initialization' }
                            };
                            $stateProviderRef.state(formLayout.sufix + part.sref, innerState);
                        }
                    });
                    //confirm inner state
                    if (!_$state_.get(formLayout.sufix + ".confirm")) {
                        var confirmState = {
                            url: '/confirm',
                            templateUrl: '../poc-common/form-display/views/form-confirm-template.html',
                            resolve: { initialization: 'initialization' }
                        };
                        $stateProviderRef.state(formLayout.sufix + ".confirm", confirmState);
                    }
                });
        };

        return {
            gen : gen
        };
    }]);
