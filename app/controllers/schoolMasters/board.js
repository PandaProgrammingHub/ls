angular.module('MyApp')
    .controller('boardController', function ($scope, $state, boardFactory) {
        $scope.getBoardDetails = function () {
            boardFactory.getBoardDetail()
                .then(function (response) {
                    $scope.boardDetails = response.data.board;
                    $scope.messages = {
                        success: [response.data]
                    };
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };
        $scope.getBoardDetails();

        // function outside(){
        //     $('body').click(function(){
        //         $('.modal-backdrop').removeClass('modal-backdrop');
        //       });
        // }

        function body_paddingRemove() {
            $('body').addClass('remove_rightpadding');
        }

        $scope.getBoardDetailsByID = function (id) {
            $scope.boardID = id;
            boardFactory.getBoardDetailByID($scope.boardID)
                .then(function (response) {
                    $scope.boardDetailsByid = response.data.board;
                    $scope.messages = {
                        success: [response.data]
                    };
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };

        $scope.addBoardDetails = function (form) {
          $scope.errorMessage = '';
            if (form.$valid) {
                boardFactory.addBoardDetail($scope.addBoardData)
                    .then(function (response) {
                        if ((response.data.success) == true) {
                            $scope.messages = {
                                success: [response.data]
                            };
                            $scope.addBoardData = {};
                            form.$setUntouched();
                            form.$setPristine(true);
                            document.getElementById("addBoardModal").style.display = "none";
                            $('.modal-backdrop').removeClass('modal-backdrop');
                            $state.reload();
                            body_paddingRemove();
                        } else {
                          $scope.errorMessage = response.data.msg;
                        }
                    })
                    .catch(function (response) {
                        $scope.messages = {
                            error: Array.isArray(response.data) ? response.data : [response.data]
                        };
                    });
            }

        };

        $scope.cancelBoard = function () {
          $scope.errorMessage = '';
            $scope.addBoardData = {};
        };

        $scope.editBoardDetails = function (form) {
            if (form.$valid) {
                boardFactory.editBoardDetail($scope.boardDetailsByid, $scope.boardID)
                    .then(function (response) {
                        if ((response.data.success) == true) {
                            $scope.messages = {
                                success: [response.data]
                            };
                            $scope.boardDetailsByid = {};
                            form.$setUntouched();
                            form.$setPristine(true);
                            document.getElementById("addBoardModal").style.display = "none";
                            $('.modal-backdrop').removeClass('modal-backdrop');
                            $state.reload();
                            body_paddingRemove();
                        } else {
                            console.log("djkskjcs");
                          $scope.errorMessage = response.data.msg;
                        }
                    })
                    .catch(function (response) {
                        $scope.messages = {
                            error: Array.isArray(response.data) ? response.data : [response.data]
                        };
                    });
            }
        };

        $scope.deleteBoardDetails = function (id) {
            $scope.id = id;
            boardFactory.deleteBoardDetail($scope.id)
                .then(function (response) {
                    $scope.messages = {
                        success: [response.data]
                    };
                    $scope.getBoardDetails();
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };
    });