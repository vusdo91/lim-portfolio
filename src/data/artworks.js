const artworks = [
  {
    id: 1,
    title: "Green",
    size: "27.3x45.5cm",
    material: "oil on linen",
    year: "2024",
    description: "",
    image: "/assets/works/Green.jpg"
  },
  {
    id: 2,
    title: "Ducks",
    size: "23.5x55cm",
    material: "oil on linen", 
    year: "2024",
    description: "",
    image: "/assets/works/Ducks.jpg"
  },
  {
    id: 3,
    title: "April",
    size: "31.8x40.9cm", 
    material: "oil on linen",
    year: "2024",
    description: "",
    image: "/assets/works/April.jpg"
  },
  {
    id: 4,
    title: "Cathedral",
    size: "40.9x31.8cm",
    material: "oil on linen",
    year: "2024", 
    description: "",
    image: "/assets/works/Cathedral.jpg"
  },
  {
    id: 5,
    title: "Chandelier",
    size: "91x91cm",
    material: "oil on linen",
    year: "2024",
    description: "",
    image: "/assets/works/Chandelier.jpg"
  },
  {
    id: 6,
    title: "Chickens",
    size: "31.8x40.9cm",
    material: "리넨에 유채",
    year: "2023",
    description: "",
    image: "/assets/works/Chickens.jpg"
  },
  {
    id: 7,
    title: "Donkeys",
    size: "31.8x40.9cm",
    material: "리넨에 유채",
    year: "2023",
    description: "",
    image: "/assets/works/Donkeys.jpg"
  },
  {
    id: 8,
    title: "Hat",
    size: "53x41cm",
    material: "oil on linen", 
    year: "2024",
    description: "",
    image: "/assets/works/Hat.jpg"
  },
  {
    id: 9,
    title: "Lions",
    size: "31.8x40.9cm",
    material: "리넨에 유채",
    year: "2023", 
    description: "",
    image: "/assets/works/Lions.jpg"
  },
  {
    id: 10,
    title: "Mirror",
    size: "60.5x50cm",
    material: "oil on linen",
    year: "2024",
    description: "",
    image: "/assets/works/Mirror.jpg"
  },
  {
    id: 11,
    title: "Mountain",
    size: "38x38cm",
    material: "oil on linen",
    year: "2024",
    description: "",
    image: "/assets/works/Mountain.jpg"
  },
  {
    id: 12,
    title: "Mountain 2",
    size: "38x38cm",
    material: "oil on linen",
    year: "2024",
    description: "",
    image: "/assets/works/Mountain_2.jpg"
  },
  {
    id: 13,
    title: "Mountain 3",
    size: "38x38cm",
    material: "oil on linen",
    year: "2024",
    description: "",
    image: "/assets/works/Mountain_3.jpg"
  },
  {
    id: 14,
    title: "Mountain 4",
    size: "38x38cm",
    material: "oil on linen",
    year: "2024",
    description: "",
    image: "/assets/works/Mountain_4.jpg"
  },
  {
    id: 15,
    title: "Mountain 5",
    size: "38x38cm",
    material: "oil on linen",
    year: "2024",
    description: "",
    image: "/assets/works/Mountain_5.jpg"
  },
  {
    id: 16,
    title: "October",
    size: "22.5x16cm", 
    material: "oil on linen",
    year: "2024",
    description: "",
    image: "/assets/works/October.jpg"
  },
  {
    id: 17,
    title: "Recommendation",
    size: "40.9x31.8cm",
    material: "oil on linen", 
    year: "2024",
    description: "",
    image: "/assets/works/Recommendation.jpg"
  },
  {
    id: 18,
    title: "Reflection",
    size: "91x91cm",
    material: "oil on linen",
    year: "2024", 
    description: "",
    image: "/assets/works/Reflection.jpg"
  },
  {
    id: 19,
    title: "Reflection 2",
    size: "91x91cm",
    material: "oil on linen",
    year: "2024", 
    description: "",
    image: "/assets/works/Reflection_2.jpg"
  },
  {
    id: 20,
    title: "Roads",
    size: "72.7x100cm",
    material: "oil on linen",
    year: "2024",
    description: "",
    image: "/assets/works/Roads.jpg"
  },
  {
    id: 21,
    title: "nightcrawler", 
    size: "45x45cm",
    material: "oil on linen",
    year: "2023",
    description: "",
    image: "/assets/works/nightcrawler.jpg"
  },
  {
    id: 22,
    title: "soap",
    size: "33.3x40.9cm", 
    material: "oil on linen",
    year: "2023",
    description: "",
    image: "/assets/works/soap.jpg"
  },
  {
    id: 23,
    title: "쌍희",
    size: "90.9x65.1cm",
    material: "oil on linen", 
    year: "2023",
    description: "",
    image: "/assets/works/쌍희.jpg"
  },
  {
    id: 24,
    title: "가와구치코행 버스에서",
    size: "130x97cm",
    material: "리넨에 유채",
    year: "2024",
    description: "",
    image: "/assets/works/가와구치코행_버스에서.jpg"
  },
  {
    id: 25,
    title: "날씨",
    size: "23.5x55cm",
    material: "oil on linen",
    year: "2024", 
    description: "",
    image: "/assets/works/날씨.jpg"
  },
  {
    id: 26,
    title: "늦여름",
    size: "27.3x22cm",
    material: "oil on linen",
    year: "2024",
    description: "", 
    image: "/assets/works/늦여름.jpg"
  },
  {
    id: 27,
    title: "무제",
    size: "53x72.5cm",
    material: "리넨에 유채",
    year: "2024",
    description: "",
    image: "/assets/works/무제.jpg"
  },
  {
    id: 28, 
    title: "바다가들린다",
    size: "116.8x80.3cm",
    material: "oil on linen",
    year: "2023",
    description: "",
    image: "/assets/works/바다가들린다.jpg"
  },
  {
    id: 29,
    title: "봉숭아물",
    size: "65.2x53cm", 
    material: "oil on linen",
    year: "2023",
    description: "",
    image: "/assets/works/봉숭아물.jpg"
  },
  {
    id: 30,
    title: "새치",
    size: "53x40.9cm",
    material: "oil on linen",
    year: "2023",
    description: "",
    image: "/assets/works/새치.jpg"
  },
  {
    id: 31,
    title: "설산이 보이는 카페 풍경",
    size: "53.0x40.9cm", 
    material: "리넨에 유채",
    year: "2023",
    description: "",
    image: "/assets/works/설산이_보이는_카페_풍경.jpg"
  },
  {
    id: 32,
    title: "야간산책",
    size: "53x41cm",
    material: "oil on linen",
    year: "2024",
    description: "",
    image: "/assets/works/야간산책.jpg"
  },
  {
    id: 33,
    title: "왜가리",
    size: "22.5x16cm",
    material: "oil on linen", 
    year: "2024",
    description: "",
    image: "/assets/works/왜가리.jpg"
  },
  {
    id: 34,
    title: "이름없는언덕",
    size: "72.7x53cm",
    material: "oil on linen",
    year: "2024",
    description: "",
    image: "/assets/works/이름없는언덕.jpg"
  },
  {
    id: 35,
    title: "조각가의 손",
    size: "31.8x31.8cm",
    material: "리넨에 유채", 
    year: "2024",
    description: "",
    image: "/assets/works/조각가의_손.jpg"
  },
  {
    id: 36,
    title: "중요한 것은 마지막에 쓰여있다",
    size: "27.3x45.5cm",
    material: "oil on linen",
    year: "2024", 
    description: "",
    image: "/assets/works/중요한_것은_마지막에_쓰여있다.jpg"
  },
  {
    id: 37,
    title: "Untitled",
    size: "37.9x45.5cm",
    material: "oil on linen",
    year: "2023",
    description: "",
    image: "/assets/works/Untitled.jpg"
  },
  {
    id: 38,
    title: "Untitled 2",
    size: "37.9x45.5cm",
    material: "oil on linen",
    year: "2023",
    description: "",
    image: "/assets/works/Untitled_2.jpg"
  },
  {
    id: 39,
    title: "Untitled 3",
    size: "37.9x45.5cm",
    material: "리넨에 유채",
    year: "2024",
    description: "",
    image: "/assets/works/Untitled_3.jpg"
  },
  {
    id: 40,
    title: "In",
    size: "112.1x112.1cm",
    material: "oil on linen",
    year: "2023",
    description: "",
    image: "/assets/works/In.jpg"
  },
  {
    id: 41,
    title: "flower",
    size: "72.7x60.6cm",
    material: "oil on linen",
    year: "2023",
    description: "",
    image: "/assets/works/flower.jpg"
  }
];

export default artworks;