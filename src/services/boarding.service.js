import { BSON } from "mongodb-stitch-browser-sdk";
import StitchService from "./stitch.service";

const stitchService = StitchService.getInstance();

const sampleData = {
  date: new Date(),
  time: new Date(),
  lattitude: "-0.02182981",
  longtitude: "-0.041231987",
  agency: "WildAid",
  vessel:{
    name: '',
    permitNumber: '',
    homePort: '',
    nationality: '',
    lastDelivery: {
      date: '',
      business: '',
      location: ''
    },
  },
  captain:{
    name: "",
    license: ""
  },
  crew:[
    {
      name: "",
      id: "",
      photoID:"",
      license:""
    }
  ],
  inspection:{
    activity: {
      name: ""
    },
    fishery: {
      name: ""
    },
    gearType: {
      name: ""
    },
    summary: {
      safetyLevel: "amber",
      violations: [
        {
          description: "Arrest of Norby Beauman",
          disposition:"Arrest"
        },
        {
          description: "Warning to Bob Beauman",
          disposition:"Warning"
        }
      ],
      seizures: [
        {
          name: "Norby Beauman",
          id: "429-76-9929",
          photoID:"5e578afce916a14463379bfe",
          license:"Norby Beauman"
        }
      ],
    },
    actualCatch: [
      {
        fish: "tuna",
        unit: "kg",
        weight: 0.23,
        count:12
      }
    ],
    risk: {
      type: "warning"
    },
    notes: [
      {
        note: "Norby Beauman"
      }
    ]
  },
  reportingOfficer: {
    agency: "WildAid",
    name: {
      first: "",
      last: ""
    }
  }
};

export default class BoardingService {
  static serviceInstance: BoardingService = null;

  static sampleData = sampleData;

  static getInstance() {
    if (BoardingService.serviceInstance == null) {
      BoardingService.serviceInstance = new BoardingService();
    }
    return BoardingService.serviceInstance;
  }

  getBoardingById(id) {
    if (id.length !== 24){
      throw new Error("Incorrect ID");
    }
    
    const objectId = new BSON.ObjectId(id);

    return stitchService.database.collection("BoardingReports").findOne({_id: objectId});
  }

  updateBoarding(object){
    if (object._id){
      object._id = new BSON.ObjectId(object._id);
      return stitchService.database.collection("BoardingReports").updateOne({
        _id : object._id
      }, object);
    } else {
      return stitchService.database.collection("BoardingReports").insertOne(object);
    }
  }

  getBoardings(limit, offset, filter) {
    return stitchService.client.callFunction("getBoardings", [limit, offset, filter]);
  }

  getBoardingsWithFacet(limit, offset, search, filter) {
    return stitchService.client.callFunction("searchFacetByBoardings", [limit, offset, search, filter]);
  }
}
