const DEMO_IMAGE_SHA256 = "53ef0ad2ae5072e24901baa47f897a72c8a6db63e184929c86c062c79c655970";

const DEMO_CALIBRATION_BOOKS = [
  { title: "The Tattooist of Auschwitz", author: "Heather Morris", confidence: 0.92, visible_text: "THE tattooist OF AUSCHWITZ", bounding_box: { x: 0.18, y: 0.15, width: 0.07, height: 0.76 } },
  { title: "The Little Prince", author: "Antoine de Saint-Exupery", confidence: 0.91, visible_text: "Antoine de Saint-Exupery The Little Prince", bounding_box: { x: 0.28, y: 0.14, width: 0.08, height: 0.75 } },
  { title: "Eleanor Oliphant Is Completely Fine", author: "Gail Honeyman", confidence: 0.88, visible_text: "Eleanor Oliphant is Completely Fine Gail Honeyman", bounding_box: { x: 0.37, y: 0.14, width: 0.09, height: 0.75 } },
  { title: "On the Road: The Original Scroll", author: "Jack Kerouac", confidence: 0.86, visible_text: "Jack Kerouac On the Road The Original Scroll", bounding_box: { x: 0.48, y: 0.13, width: 0.08, height: 0.74 } },
  { title: "The Road Less Travelled", author: "M. Scott Peck", confidence: 0.8, visible_text: "The Road Less Travelled M. Scott Peck", bounding_box: { x: 0.63, y: 0.18, width: 0.08, height: 0.66 } },
  { title: "Animal Farm", author: "George Orwell", confidence: 0.72, visible_text: "ANIMAL FARM", bounding_box: { x: 0.72, y: 0.15, width: 0.08, height: 0.72 } },
  { title: "The Memory Keeper's Daughter", author: "Kim Edwards", confidence: 0.84, visible_text: "KIM EDWARDS THE MEMORY KEEPER'S DAUGHTER", bounding_box: { x: 0.78, y: 0.07, width: 0.08, height: 0.82 } },
  { title: "Sophie's Choice", author: "William Styron", confidence: 0.83, visible_text: "WILLIAM STYRON Sophie's Choice", bounding_box: { x: 0.92, y: 0.12, width: 0.07, height: 0.74 } },
];

module.exports = {
  DEMO_IMAGE_SHA256,
  DEMO_CALIBRATION_BOOKS,
};
