app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'GalleryCtrl'
    });
});

app.factory('GalleryFactory', function($http) {
    var api_key = '09547e856e2c7a560ea1fdd5642e2212';
    var GalleryFactory = {};

    GalleryFactory.getPhotos = function(pageNumber, tag) {
        if (!pageNumber) {
            pageNumber = 1;
        }
        if (!tag) {
            tag = 'random'
        }
        return $http.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + api_key + '&tags=' + tag + '&tag_mode=all&page=' + pageNumber + '&per_page=10&format=json&nojsoncallback=?')
            .then(function(photos) {
                return photos.data.photos
            })
    }

    return GalleryFactory
})

app.controller('GalleryCtrl', function($scope, GalleryFactory) {
    $scope.openedPhoto = false;
    $scope.searchPhotos = false;

    //add photosObject to scope
    $scope.search = function(pageNumber, tag) {
        GalleryFactory.getPhotos(pageNumber, tag)
            .then(function(photosObject) {
                $scope.photos = photosObject.photo;
                if (photosObject.pages > 10) {
                    photosObject.pages = 10;
                }
                $scope.totalPages = photosObject.pages;
                $scope.page = photosObject.page;
                var index = 1;
                var totalPages = $scope.totalPages;
                var pageArray = [];
                while (index <= totalPages) {
                    pageArray.push(index)
                    index++
                }
                $scope.pages = pageArray;
                $scope.searchPhotos = true;
                $scope.tag = tag;
            })
    }

    //pagination
    $scope.changePage = function(pageNumber, tag) {
        GalleryFactory.getPhotos(pageNumber, tag)
            .then(function(photos) {
                $scope.photos = photos.photo;
                $scope.page = photos.page;
            })
    }

    //go back one page
    $scope.backPage = function(page, tag) {
            if (page === 1) {
                return;
            }
            page--;
            $scope.changePage(page, tag);
        }
        //go forward one page
    $scope.nextPage = function(page, tag) {
        if (page === $scope.totalPages) {
            return;
        }
        page++;
        $scope.changePage(page, tag)
    }

    //modal to enlarge photo
    $scope.showModal = function(photo) {
        photo = photo.photo;
        $scope.currentPhoto = photo;
        //create photo source
        $scope.selectedPhotoSrc = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_s.jpg'

        //open modal
        $('.modal').show();
        $scope.openedPhoto = true;
    }

    //close modal
    $scope.closeModal = function() {
        $scope.openedPhoto = false;
        $('.modal').hide();
    }

})
