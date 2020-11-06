import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.page.html',
  styleUrls: ['./user-feed.page.scss'],
})
export class UserFeedPage implements OnInit {

    feedList: any = [];
  ngOnInit() {
  }

  getImages() {
    this.authService.getImages().subscribe((data) => {
        console.log(data);
        this.feedList = data;
    });
  }

    // feedList = [
    //     {
    //         userName: 'David Nick',
    //         userImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT_ilM7E3aZocNUE01o1Gd-zd7A8668HlWeIblKAqGLcG-2OO0o',
    //         slides: [
    //             {
    //                 image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR569djObZYNcghtumCNFRidZcAOouZs7lz-tGpjqFDUK68DDg2'
    //             }
    //         ],
    //         likes: 10,
    //         feedText: 'Lunch @Houstan',
    //         time: 'Just Now'
    //     },
    //     {
    //         userName: 'John Watson',
    //         userImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRbgRz3TYR0yIMijWAG4yM-wFl_SCit8aGNldLahP3kEIH1ODFx',
    //         slides: [
    //             {
    //                 image: 'http://thedreamwithinpictures.com/wp-content/uploads/2015/09/64ffc__11261919_650652038398443_1773559261_n.jpg'
    //             },
    //             {
    //                 image: 'https://cdn.guff.com/site_2/media/17000/16381/items/20a68e811cb075b5dd0cc9a7.jpg'
    //             },
    //             {
    //                 image: 'https://petapixel.com/assets/uploads/2015/09/Z.jpg'
    //             },
    //             {
    //                 image: 'https://petapixel.com/assets/uploads/2015/09/11348363_121691131510970_596893135_n.jpg'
    //             }
    //         ],
    //         likes: 323,
    //         feedText: 'From Mumbai',
    //         time: '3 Hours ago'
    //     },
    //     {
    //         userName: 'Anderson',
    //         userImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_k8OI5LCICslf_OzVMBzMMA7GblWc4iL0hCL0m7jXON3GNDwH',
    //         userPlace: 'Newyork',
    //         slides: [
    //             {
    //                 image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSVd57Rh4SLipxD_I4ikAjXk4A6B9b69SoyoiKa0Y3YC-Vc31iC'
    //             },
    //             {
    //                 image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT2XXwZeGmG2LjAYFwnFS0KgHmHo0GP8pp2_VIKMYA_lYW79t43'
    //             },
    //             {
    //                 image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQnoRsDHvSC2mYgY2HDNgMrkW3vPWO5b1P--snWW-ZGSah71MaL'
    //             }
    //         ],
    //         likes: 120,
    //         feedText: 'Lovely places',
    //         time: '3 Days ago'
    //     }
    // ];

    slideOpts = {
        initialSlide: 0,
        speed: 400
    };

    constructor(private authService: AuthService) {
        this.getImages();
    }

    logout() {
        this.authService.logout();
      }

}
