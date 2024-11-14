import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {

    stable var bloodPressureRecords : [(Nat, Nat, Text, Text)] = [];

    public shared func addBloodPressureRecord(systolic : Nat, diastolic : Nat, date : Text, time : Text) : async () {
        bloodPressureRecords := Array.append<(Nat, Nat, Text, Text)>(bloodPressureRecords, [(systolic, diastolic, date, time)]);
    };

    public query func getBloodPressureRecords() : async [(Nat, Nat, Text, Text)] {
        return bloodPressureRecords;
    };
};
