declare namespace Cart {
  export type Order = {
    items: Item[];
  };

  export type Item = {
    id: number;
    quantity: number;
  };
}