// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPniK95fGrS4g05sQxgzdKtS4islPP5YU",
  authDomain: "roomsreservation-9ff2c.firebaseapp.com",
  projectId: "roomsreservation-9ff2c",
  storageBucket: "roomsreservation-9ff2c.firebasestorage.app",
  messagingSenderId: "830447979882",
  appId: "1:830447979882:web:edbdc0ade97d71b3846913",
  measurementId: "G-G41DZMBYNX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Function to handle booking submission
document.getElementById("bookingForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent page reload

    // Get user input values
    const fullName = document.getElementById("full name").value;
    const email = document.getElementById("email address").value;
    const checkIn = document.getElementById("check-in").value;
    const checkOut = document.getElementById("check-out").value;
    const selectedRoom = document.getElementById("selected room").value;
    const extraPax = parseInt(document.getElementById("extra pax").value) || 0;
    const totalAmount = parseFloat(document.getElementById("total amount to pay").value);
    const numberOfNights = parseInt(document.getElementById("number of nights").value);

    // Check availability before booking
    try {
        const bookingsRef = collection(db, "agcararaobooking", "bookings");
        const q = query(
            bookingsRef,
            where("selectedRoom", "==", selectedRoom),
            where("isConfirmed", "==", true)
        );
        
        const querySnapshot = await getDocs(q);
        let isAvailable = true;
        
        const newCheckIn = new Date(checkIn);
        const newCheckOut = new Date(checkOut);
        
        querySnapshot.forEach((doc) => {
            const booking = doc.data();
            const bookedCheckIn = booking.checkIn.toDate();
            const bookedCheckOut = booking.checkOut.toDate();
            
            // Check for overlapping dates
            if ((newCheckIn >= bookedCheckIn && newCheckIn < bookedCheckOut) ||
                (newCheckOut > bookedCheckIn && newCheckOut <= bookedCheckOut) ||
                (newCheckIn <= bookedCheckIn && newCheckOut >= bookedCheckOut)) {
                isAvailable = false;
            }
        });
        
        if (!isAvailable) {
            alert("This cottage is not available for the selected dates. Please choose different dates or a different cottage.");
            return;
        }

        // Save booking details to Firestore
        try {
            const docRef = await addDoc(collection(db, "agcararaobooking", "bookings"), {
                fullName: fullName,
                email: email,
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                selectedRoom: selectedRoom,
                extraPax: extraPax,
                totalAmount: totalAmount,
                numberOfNights: numberOfNights,
                isConfirmed: true
            });

            alert("Booking successful! Please proceed with the 30% down payment. We will contact you shortly.");
            window.location.href = "confirmation.html?bookingId=" + docRef.id;
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Booking failed! Please try again.");
        }
    } catch (error) {
        console.error("Error checking availability:", error);
        alert("Error checking availability. Please try again.");
    }
});
