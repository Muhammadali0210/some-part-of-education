export interface Course {
    _id?: Number;
    title: String,
    description: String,
    learning: String,
    requirements: String,
    level: String,
    language: String,
    category: String,
    oldPrice: Number,
    currentPrice: Number,
    previewImage?: String | null,
    published: Boolean,
    __v?: Number
}

export interface Group {
    _id?: Number;
    name: String,
    degree: String,
    studentCount: Number,
    __v?: Number 
}