// PostDataModel.js (hoặc PostDataModel.ts)
export class PostDataModel {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.title = data.title;
    this.subtitle = data.subtitle;
    this.imageList = data.imageList || [];
    this.restaurantId = data.restaurantId;
    this.createAt = data.createAt;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.placeMap = data.placeMap || {};
    this.status = data.status;
  }

  // Chuyển đổi từ JSON sang đối tượng PostDataModel
  static fromJson(json) {
    return new PostDataModel({
      id: json.id,
      userId: json.userId,
      title: json.title,
      subtitle: json.subtitle,
      imageList: json.imageList || [],
      restaurantId: json.restaurantId,
      createAt: json.createAt,
      latitude: json.latitude,
      longitude: json.longitude,
      placeMap: json.placeMap || {},
      status: json.status,
    });
  }

  // Chuyển đổi từ DocumentSnapshot sang PostDataModel
  static fromDocumentSnapshot(doc) {
    const json = doc.data();
    return new PostDataModel({
      id: json.id,
      userId: json.userId,
      title: json.title,
      subtitle: json.subtitle,
      imageList: json.imageList || [],
      restaurantId: json.restaurantId,
      createAt: json.createAt,
      latitude: json.latitude,
      longitude: json.longitude,
      placeMap: json.placeMap || {},
      status: json.status,
    });
  }

  // Chuyển đổi từ PostDataModel sang JSON
  toJson() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      subtitle: this.subtitle,
      imageList: this.imageList,
      restaurantId: this.restaurantId,
      createAt: this.createAt,
      latitude: this.latitude,
      longitude: this.longitude,
      placeMap: this.placeMap,
      status: this.status,
    };
  }
}

// UserModel.js

export class UserModel {
  constructor(data) {
    this.uid = data.uid;
    this.password = data.password || null;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber || null;
    this.displayName = data.displayName || null;
    this.avatarUrl = data.avatarUrl || null;
    this.backgroundUrl = data.backgroundUrl || null;
    this.createdAt = data.createdAt || null;
    this.isComplete = data.isComplete || null;
  }

  // Chuyển đổi từ JSON sang đối tượng UserModel
  static fromJson(json) {
    return new UserModel({
      uid: json.uid,
      password: json.password,
      email: json.email,
      phoneNumber: json.phoneNumber,
      displayName: json.displayName,
      avatarUrl: json.avatarUrl,
      backgroundUrl: json.backgroundUrl,
      createdAt: json.createdAt,
      isComplete: json.isComplete,
    });
  }

  // Chuyển đổi từ DocumentSnapshot sang UserModel
  static fromDocumentSnapshot(doc) {
    const json = doc.data();
    return new UserModel({
      uid: json.uid,
      password: json.password,
      email: json.email,
      phoneNumber: json.phoneNumber,
      displayName: json.displayName,
      avatarUrl: json.avatarUrl,
      backgroundUrl: json.backgroundUrl,
      createdAt: json.createdAt,
      isComplete: json.isComplete,
    });
  }

  // Chuyển đổi từ UserModel sang JSON
  toJson() {
    return {
      uid: this.uid,
      password: this.password,
      email: this.email,
      phoneNumber: this.phoneNumber,
      displayName: this.displayName,
      avatarUrl: this.avatarUrl,
      backgroundUrl: this.backgroundUrl,
      createdAt: this.createdAt,
      isComplete: this.isComplete,
    };
  }
}

export class RestaurantModel {
  constructor(id, userId, nameRestaurant, emailRestaurant, phoneRestaurant, addressRestaurant, licenseRestaurant,onwnerLicenseImages, avatarUrl, backgroundUrl, status) {
    this.idRestaurant = id;
    this.userId = userId;
    this.nameRestaurant = nameRestaurant;
    this.emailRestaurant = emailRestaurant;
    this.phoneRestaurant = phoneRestaurant;
    this.addressRestaurant = addressRestaurant;
    this.licenseRestaurant = licenseRestaurant;
    this.onwnerLicenseImages = onwnerLicenseImages;
    this.avatarUrl = avatarUrl;
    this.backgroundUrl = backgroundUrl;
    this.status = status;
  }

  static fromDocumentSnapshot(doc) {
    const data = doc.data();
    return new RestaurantModel(
      doc.id,
      data.userId,
      data.nameRestaurant,
      data.emailRestaurant,
      data.phoneRestaurant,
      data.addressRestaurant,
      data.licenseRestaurant,
      data.onwnerLicenseImages,
      data.avatarUrl,
      data.backgroundUrl,
      data.status
    );
  }
}