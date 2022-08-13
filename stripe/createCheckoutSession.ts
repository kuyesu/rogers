import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase/index";
import getStripe from "./initializeStripe";

export async function createCheckoutSession(uid: string) {
  const stripe = await getStripe();
}
