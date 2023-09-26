// to maintain flow for patient in add patient

import React, { createContext, useState, useEffect } from "react";

import ChiefComplaintsData from "../constants/symptomsData/ChiefComplaintData";
import ChronicDiseasesData from "../constants/symptomsData/ChronicDieaseData";
import LifeStyleHabitsData from "../constants/symptomsData/LifeStyleHabitsData";
import AnteriorTaggingData from "../constants/TaggingData/AnteriorTaggingData";
import PosteriorTaggingData from "../constants/TaggingData/PosteriorTaggingData";
import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LungXinstance from "../api/server";
import { AuthContext } from "./AuthContext";

export const AddPatientContext = createContext({});

const SymptomsData = [
  {
    id: 1,
    position: "Coarse crackle",
    isChecked: false,
  },
  {
    id: 2,
    position: "Fine crackle",
    isChecked: false,
  },
  {
    id: 3,
    position: "Ronchi",
    isChecked: false,
  },
  {
    id: 4,
    position: "Wheeze",
    isChecked: false,
  },

  {
    id: 5,
    position: "Normal",
    isChecked: false,
  },

  {
    id: 6,
    position: "All",
    isChecked: false,
  },
];

export const AddPatientProvider = ({ children }) => {


  const [patientstatus, setpatientstatus] = useState("");
  const [patientname, setpatientname] = useState("");
  const [patientid, setpatientid] = useState(Math.floor(Math.random() * 100000000));
  const [patientAge, setpatientAge] = useState("");
  const [patientGender, setpatientGender] = useState([
    {
      gender: "male",
      isChecked: false,
      id: 1,
    },
    {
      gender: "female",
      isChecked: false,
      id: 2,
    },
  ]);

  const [patientWeight, setpatientWeight] = useState("");
  const [patientTemperture, setpatientTemperature] = useState("");
  const [patientOxygenLevel, setpatientPatientOxygenLevel] = useState("");
  const [patientBloodPressure, setpatientBloodPressure] = useState("");

  const [ChiefSymptomsData, setChiefSymptomsData] =
    useState(ChiefComplaintsData);
  const [ChronicSymptomsData, setChronicSymptomsData] =
    useState(ChronicDiseasesData);

  const [LifeStyleHabits, setLifeStyleHabits] = useState(LifeStyleHabitsData);

  const [additionalNotes, setaddtionalNotes] = useState("")
  const [diagonsisNotes, setDiagonsisNotes] = useState("")

  const [filteredChiefSymptoms, setfilteredChiefSymptomsData] = useState([])
  const [filteredChronicSymptoms, setfilteredChronicSymptomsData] = useState([])
  const [filteredLifeStyle, setfilteredLifeStyleData] = useState([])

  const [tags, settags] = useState(SymptomsData);
  const [AnteriorTagging, setAnteriorTagging] = useState(AnteriorTaggingData);
  const [filteredAnteriorTags, setfilteredAnteriorTags] = useState([])
  const [PosteriorTagging, setPosteriorTagging] = useState(PosteriorTaggingData);
  const [filteredPosteriorTags, setfilteredPosteriorTags] = useState([])
  const [newlyCreatedPatientId, setNewlyCreatedPatientId] = useState(null)
  const [newlyCreatedPatientMoreDetailId, setNewlyCreatedPatientMoreDetailId] = useState(null)
  const [newlyCreatedPatientLungsId, setNewlyCreatedPatientLungsId] = useState(null)
  const [sessionNo, setSessionNo] = useState(null)
  const [recordings, setRecordings] = useState([
    {
      id: 0,
      name: "Rec 0",
      sound: "",
      duration: "",
      file: "",
      State: null,
      style: lungs.btn0,
      key: "p0_audio",

    },
    {
      id: 1,
      name: "Rec 1",
      sound: "",
      duration: "",
      file: "",
      State: null,
      style: lungs.btn1,
      key: "p1_audio",
    },
    {
      id: 2,
      name: "Rec 2",
      sound: "",
      duration: "",
      file: "",
      State: null,
      style: lungs.btn2,
      key: "p2_audio",
    },
    {
      id: 3,
      name: "Rec 3",
      sound: "",
      duration: "",
      file: "",
      State: null,
      style: lungs.btn3,
      key: "p3_audio",
    },
    {
      id: 4,
      name: "Rec 4",
      sound: "",
      duration: "",
      file: "",
      State: null,
      style: lungs.btn4,
      key: "p4_audio",
    },
    {
      id: 5,
      name: "Rec 5",
      sound: "",
      duration: "",
      file: "",
      State: null,
      style: lungs.btn5,
      key: "p5_audio",
    },
    {
      id: 6,
      name: "Rec 6",
      sound: "",
      duration: "",
      file: "",
      State: null,
      style: lungs.btn6,
      key: "p6_audio",
    },
  ]);
  const [recordingsPosterior, setRecordingsPosterior] = useState([
    {
      id: 7,
      name: "Rec 7",
      sound: "",
      duration: "",
      file: "",
      State: null,
      style: lungsPosterior.btn7,
      key: "p7_audio",

    },
    {
      id: 8,
      name: "Rec 8",
      sound: "",
      duration: "",
      file: "",
      State: null,
      style: lungsPosterior.btn8,
      key: "p8_audio",
    },
    {
      id: 9,
      name: "Rec 9",
      sound: "",
      duration: "",
      file: "",
      State: null,
      style: lungsPosterior.btn9,
      key: "p9_audio",
    },
    {
      id: 10,
      name: "Rec 10",
      sound: "",
      duration: "",
      file: "",
      State: null,
      style: lungsPosterior.btn10,
      key: "p10_audio",
    },
    {
      id: 11,
      name: "Rec 11",
      sound: "",
      duration: "",
      file: "",
      State: null,
      style: lungsPosterior.btn11,
      key: "p11_audio",
    },
    {
      id: 12,
      name: "Rec 12",
      sound: "",
      duration: "",
      file: "",
      State: null,
      style: lungsPosterior.btn12,
      key: "p12_audio",
    },
  ]);



  const resetStateObj = () => {
    setpatientstatus(""),
      setpatientname(""),
      setpatientid(""),
      setpatientAge(""),
      setpatientWeight(""),
      setpatientTemperature(""),
      setpatientPatientOxygenLevel(""),
      setpatientBloodPressure(""),
      setaddtionalNotes(""),
      setDiagonsisNotes(""),
      setfilteredChiefSymptomsData([]),
      setfilteredChronicSymptomsData([]),
      setfilteredLifeStyleData([]),
      setfilteredAnteriorTags([]),
      setfilteredPosteriorTags([]),
      setNewlyCreatedPatientId(null),
      setNewlyCreatedPatientMoreDetailId(null),
      setNewlyCreatedPatientLungsId(null),
      setSessionNo(null)
    setpatientGender([
      {
        gender: "male",
        isChecked: false,
        id: 1,
      },
      {
        gender: "female",
        isChecked: false,
        id: 2,
      },
    ])
    setPosteriorTagging(PosteriorTaggingData)
    setAnteriorTagging(AnteriorTaggingData)
    settags(SymptomsData)
    setLifeStyleHabits(LifeStyleHabitsData)
    setChronicSymptomsData(ChronicDiseasesData)
    setChiefSymptomsData(ChiefComplaintsData)
    setRecordings([
      {
        id: 0,
        name: "Rec 0",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn0,
        key: "p0_audio",

      },
      {
        id: 1,
        name: "Rec 1",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn1,
        key: "p1_audio",
      },
      {
        id: 2,
        name: "Rec 2",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn2,
        key: "p2_audio",
      },
      {
        id: 3,
        name: "Rec 3",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn3,
        key: "p3_audio",
      },
      {
        id: 4,
        name: "Rec 4",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn4,
        key: "p4_audio",
      },
      {
        id: 5,
        name: "Rec 5",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn5,
        key: "p5_audio",
      },
      {
        id: 6,
        name: "Rec 6",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn6,
        key: "p6_audio",
      },
    ])
    setRecordingsPosterior([
      {
        id: 7,
        name: "Rec 7",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungsPosterior.btn7,
        key: "p7_audio",

      },
      {
        id: 8,
        name: "Rec 8",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungsPosterior.btn8,
        key: "p8_audio",
      },
      {
        id: 9,
        name: "Rec 9",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungsPosterior.btn9,
        key: "p9_audio",
      },
      {
        id: 10,
        name: "Rec 10",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungsPosterior.btn10,
        key: "p10_audio",
      },
      {
        id: 11,
        name: "Rec 11",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungsPosterior.btn11,
        key: "p11_audio",
      },
      {
        id: 12,
        name: "Rec 12",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungsPosterior.btn12,
        key: "p12_audio",
      },
    ])


  }
  // question select handling

  const handleChiefSymptomsQuestionSelect = (questionID) => {
    console.log("questionID--------------")
    // console.log(questionID)
    const UpdatedData = ChiefSymptomsData.map((question) => {
      if (question.id === questionID) {
        return { ...question, isChecked: !question.isChecked, optionid: null };
      } else {
        return { ...question };
      }
    });
    setChiefSymptomsData(UpdatedData);
  };


  const handleChronicSymptomsQuestionSelect = (questionID) => {
    const UpdatedData = ChronicSymptomsData.map((question) => {
      if (question.id === questionID) {
        return { ...question, isChecked: !question.isChecked };
      } else {
        return { ...question };
      }
    });
    setChronicSymptomsData(UpdatedData);
  };


  const handleLifeStyleHabitsQuestionSelect = (questionID) => {
    const UpdatedData = LifeStyleHabits.map((question) => {
      if (question.id === questionID) {
        return { ...question, isChecked: !question.isChecked };
      } else {
        return { ...question };
      }
    });
    setLifeStyleHabits(UpdatedData);
  };

  const handleChiefOptionSelect = (optionID, indexOfOptioninQuestion) => {
    console.log("optionID, indexOfOptioninQuestion---------------")
    // console.log(optionID, indexOfOptioninQuestion)
    const UpdatedOptions = ChiefSymptomsData.map((question, index) => {
      if (question.isChecked === true && index === indexOfOptioninQuestion) {
        const UpdatedSelection = question.options.map((option) => {
          if (option.id === optionID) {
            return { ...option, isChecked: !option.isChecked };
          } else {
            return { ...option, isChecked: false };
          }
        });
        return { ...question, options: UpdatedSelection };
      } else {
        return { ...question };
      }
    });

    setChiefSymptomsData(UpdatedOptions);
  };


  const handleChronicOptionSelect = (optionID, indexOfOptioninQuestion) => {
    // console.log("index of option", indexOfOptioninQuestion);
    const UpdatedOptions = ChronicSymptomsData.map((question, index) => {
      if (question.isChecked === true && index === indexOfOptioninQuestion) {
        const UpdatedSelection = question.options.map((option) => {
          if (option.id === optionID) {
            return { ...option, isChecked: !option.isChecked };
          } else {
            return { ...option, isChecked: false };
          }
        });
        return { ...question, options: UpdatedSelection };
      } else {
        return { ...question };
      }
    });

    // console.log(UpdatedOptions);
    setChronicSymptomsData(UpdatedOptions);
  };

  const handleLifeStyleHabitsOptionSelect = (
    optionID,
    indexOfOptioninQuestion
  ) => {
    const UpdatedOptions = LifeStyleHabits.map((question, index) => {
      if (question.isChecked === true && index === indexOfOptioninQuestion) {
        const UpdatedSelection = question.options.map((option) => {
          if (option.id === optionID) {
            return { ...option, isChecked: !option.isChecked };
          } else {
            return { ...option, isChecked: false };
          }
        });
        return { ...question, options: UpdatedSelection };
      } else {
        return { ...question };
      }
    });

    // console.log(UpdatedOptions);
    setLifeStyleHabits(UpdatedOptions);
  };


  const handleFilteringofForm = () => {
    // console.log(ChiefSymptomsData)

    const reducedChiefSymptomsData = ChiefSymptomsData.map((item) => {
      if (item.isChecked) {
        const selectedOption = item.options.find((option) => option.isChecked);
        if (selectedOption) {
          return {
            id: item.id,
            title: item.title,
            option: selectedOption.title,
          };
        }
      }
    }).filter(Boolean);
    // console.log("Filtered Data", reducedChiefSymptomsData );
    setfilteredChiefSymptomsData(reducedChiefSymptomsData)


    const reducedLifeStyleHabitsData = LifeStyleHabits.map((item) => {
      if (item.isChecked) {
        const selectedOption = item.options.find((option) => option.isChecked);
        if (selectedOption) {
          return {
            id: item.id,
            title: item.title,
            option: selectedOption.title,
          };
        }
      }
    }).filter(Boolean);

    // console.log(reducedLifeStyleHabitsData);

    setfilteredLifeStyleData(reducedLifeStyleHabitsData)

    const reducedChronicData = ChronicSymptomsData.map((item) => {
      if (item.isChecked) {
        const selectedOption = item.options.find((option) => option.isChecked);
        if (selectedOption) {
          return {
            id: item.id,
            title: item.title,
            option: selectedOption.title,
          };
        }
      }
    }).filter(Boolean);

    // console.log(reducedChronicData);

    setfilteredChronicSymptomsData(reducedChronicData)
  }


  const handleTaggingAllAnteriorPosition = (symptomsName, state) => {
    const newtag = tags.map((symptoms) => {
      if (symptoms.position === symptomsName && state) return { ...symptoms, isChecked: true };
      if (symptoms.position === symptomsName && !state) return { ...symptoms, isChecked: false };
      return symptoms;
    });
    settags(newtag);

    const newAnteriorTagging = AnteriorTagging.map((position) => {
      const newAnteriorOption = position.options.map((symptoms) => {
        if (symptoms.position === symptomsName && state) return { ...symptoms, isChecked: true };
        if (symptoms.position === symptomsName && !state) return { ...symptoms, isChecked: false };
        return symptoms;
      });
      return { ...position, options: newAnteriorOption };
    });
    setAnteriorTagging(newAnteriorTagging);
  };


  const handleTagDiscarding = () => {
    const newtags = tags.map((symptoms) => {
      return { ...symptoms, isChecked: false };
    });
    settags(newtags);
    const newAnteriorTagging = AnteriorTagging.map((position) => {
      const newOptions = position.options.map((option) => {
        return { ...option, isChecked: false };
      });
      return { ...position, options: newOptions };
    });
    setAnteriorTagging(newAnteriorTagging);
  };

  //Anterior Tagging controller runs on  input changes (checkboxes)

  const handleAnteriorPositionTagging = (positionid, optionid, state) => {

    const newAnteriorTagging = AnteriorTagging.map((position) => {

      if (position.id === positionid && optionid != 6) {

        const newOptions = position.options.map((option) => {
          if (option.id === optionid) {
            return { ...option, isChecked: !option.isChecked };
          }

          return option;
        });
        return { ...position, options: newOptions };
      }
      if (optionid == 6 && position.id === positionid) {
        const newOptions = position.options.map((option) => {
          if (!state) {
            return { ...option, isChecked: false };
          }
          if (state) {
            return { ...option, isChecked: true };
          }
          return option;
        });
        return { ...position, options: newOptions };
      }
      return position;
    });
    setAnteriorTagging(newAnteriorTagging);
  };

  //Anterior Tagging controller runs on submit all inputs (checkboxes)
  const handleAnteriorFiltering = ({ id, doctor, patient }) => {
    const filteredAnteriorTaggingData = AnteriorTagging.map((item) => {
      const selectedOptions = item.options.filter((option) => option.isChecked);
      if (selectedOptions.length > 0) {
        return {
          id: item.id,
          position: item.position,
          optionid: item.optionid,
          options: selectedOptions,
        };
      } else {
        return {
          id: item.id,
          position: item.position,
          optionid: item.optionid,
          options: [
            {
              id: 5,
              position: "Normal",
              isChecked: true,
            },
          ],
        };
      }
    });

    let payload = {
      id,
      doctor,
      patient
    }
    console.log("payload---------------at----")
    // console.log(payload)
    filteredAnteriorTaggingData.forEach((ele, index) => {
      payload["p" + `${index}` + "_tag"] = JSON.stringify(ele)
    })
    setfilteredAnteriorTags(filteredAnteriorTaggingData);
    LungXinstance.patch("/api/lung_audio/", payload)
  }
  const handlePosteriorfiltering = ({ id, doctor, patient }) => {
    const filteredPosteriorTaggingData = PosteriorTagging.map((item) => {
      const selectedOptions = item.options.filter((option) => option.isChecked);
      if (selectedOptions.length > 0) {
        return {
          id: item.id,
          position: item.position,
          optionid: item.optionid,
          options: selectedOptions,
        };
      } else {
        return {
          id: item.id,
          position: item.position,
          optionid: item.optionid,
          options: [
            {
              id: 5,
              position: "Normal",
              isChecked: true,
            },
          ],
        };
      }
    });
    setfilteredPosteriorTags(filteredPosteriorTaggingData);
    let payload = {
      id,
      doctor,
      patient
    }
    console.log("payload-------------")
    // console.log(payload)
    filteredPosteriorTaggingData.forEach((ele, index) => {
      payload["p" + `${index + 7}` + "_tag"] = JSON.stringify(ele)

    })
    setfilteredPosteriorTags(filteredPosteriorTaggingData);
    LungXinstance.patch("/api/lung_audio/", payload)
  }

  const handleClearAddPatientData = () => {
    setpatientstatus(""),
      setpatientname(""),
      setpatientid(""),
      setpatientAge(""),
      setpatientWeight(""),
      setpatientTemperature(""),
      setpatientPatientOxygenLevel(""),
      setpatientBloodPressure(""),
      setaddtionalNotes(""),
      setDiagonsisNotes(""),
      setfilteredChiefSymptomsData([]),
      setfilteredChronicSymptomsData([]),
      setfilteredLifeStyleData([]),
      setfilteredAnteriorTags([]),
      setfilteredPosteriorTags([]),
      setNewlyCreatedPatientId(null),
      setNewlyCreatedPatientMoreDetailId(null),
      setNewlyCreatedPatientLungsId(null),
      setSessionNo(null)
    setpatientGender([
      {
        gender: "male",
        isChecked: false,
        id: 1,
      },
      {
        gender: "female",
        isChecked: false,
        id: 2,
      },
    ])
    setPosteriorTagging([
      {
        id: 1,
        position: "Postion 7",
        optionid: 1,
        options: [
          {
            id: 1,
            position: "Coarse crackle",
            isChecked: false,
          },
          {
            id: 2,
            position: "Fine crackle",
            isChecked: false,
          },
          {
            id: 3,
            position: "Ronchi",
            isChecked: false,
          },
          {
            id: 4,
            position: "Wheeze",
            isChecked: false,
          },

          {
            id: 5,
            position: "Normal",
            isChecked: false,
          },

          {
            id: 6,
            position: "All",
            isChecked: false,
          },
        ],
      },

      {
        id: 2,
        position: "Postion 8",
        optionid: 1,
        options: [
          {
            id: 1,
            position: "Coarse crackle",
            isChecked: false,
          },
          {
            id: 2,
            position: "Fine crackle",
            isChecked: false,
          },
          {
            id: 3,
            position: "Ronchi",
            isChecked: false,
          },
          {
            id: 4,
            position: "Wheeze",
            isChecked: false,
          },

          {
            id: 5,
            position: "Normal",
            isChecked: false,
          },

          {
            id: 6,
            position: "All",
            isChecked: false,
          },
        ],
      },
      {
        id: 3,
        position: "Postion 9",
        optionid: 1,
        options: [
          {
            id: 1,
            position: "Coarse crackle",
            isChecked: false,
          },
          {
            id: 2,
            position: "Fine crackle",
            isChecked: false,
          },
          {
            id: 3,
            position: "Ronchi",
            isChecked: false,
          },
          {
            id: 4,
            position: "Wheeze",
            isChecked: false,
          },

          {
            id: 5,
            position: "Normal",
            isChecked: false,
          },

          {
            id: 6,
            position: "All",
            isChecked: false,
          },
        ],
      },
      {
        id: 4,
        position: "Postion 10",
        optionid: 1,
        options: [
          {
            id: 1,
            position: "Coarse crackle",
            isChecked: false,
          },
          {
            id: 2,
            position: "Fine crackle",
            isChecked: false,
          },
          {
            id: 3,
            position: "Ronchi",
            isChecked: false,
          },
          {
            id: 4,
            position: "Wheeze",
            isChecked: false,
          },

          {
            id: 5,
            position: "Normal",
            isChecked: false,
          },

          {
            id: 6,
            position: "All",
            isChecked: false,
          },
        ],
      },
      {
        id: 5,
        position: "Postion 11",
        optionid: 1,
        options: [
          {
            id: 1,
            position: "Coarse crackle",
            isChecked: false,
          },
          {
            id: 2,
            position: "Fine crackle",
            isChecked: false,
          },
          {
            id: 3,
            position: "Ronchi",
            isChecked: false,
          },
          {
            id: 4,
            position: "Wheeze",
            isChecked: false,
          },

          {
            id: 5,
            position: "Normal",
            isChecked: false,
          },

          {
            id: 6,
            position: "All",
            isChecked: false,
          },
        ],
      },
      {
        id: 6,
        position: "Postion 12",
        optionid: 1,
        options: [
          {
            id: 1,
            position: "Coarse crackle",
            isChecked: false,
          },
          {
            id: 2,
            position: "Fine crackle",
            isChecked: false,
          },
          {
            id: 3,
            position: "Ronchi",
            isChecked: false,
          },
          {
            id: 4,
            position: "Wheeze",
            isChecked: false,
          },

          {
            id: 5,
            position: "Normal",
            isChecked: false,
          },

          {
            id: 6,
            position: "All",
            isChecked: false,
          },
        ],
      },

    ])
    setAnteriorTagging([
      {
        id: 1,
        position: "Position 0",
        optionid: 1,
        options: [
          {
            id: 1,
            position: "Coarse crackle",
            isChecked: false,
          },
          {
            id: 2,
            position: "Fine crackle",
            isChecked: false,
          },
          {
            id: 3,
            position: "Ronchi",
            isChecked: false,
          },
          {
            id: 4,
            position: "Wheeze",
            isChecked: false,
          },

          {
            id: 5,
            position: "Normal",
            isChecked: false,
          },

          {
            id: 6,
            position: "All",
            isChecked: false,
          },
        ],
      },

      {
        id: 2,
        position: "Position 1",
        optionid: 1,
        options: [
          {
            id: 1,
            position: "Coarse crackle",
            isChecked: false,
          },
          {
            id: 2,
            position: "Fine crackle",
            isChecked: false,
          },
          {
            id: 3,
            position: "Ronchi",
            isChecked: false,
          },
          {
            id: 4,
            position: "Wheeze",
            isChecked: false,
          },

          {
            id: 5,
            position: "Normal",
            isChecked: false,
          },

          {
            id: 6,
            position: "All",
            isChecked: false,
          },
        ],
      },
      {
        id: 3,
        position: "Position 2",
        optionid: 1,
        options: [
          {
            id: 1,
            position: "Coarse crackle",
            isChecked: false,
          },
          {
            id: 2,
            position: "Fine crackle",
            isChecked: false,
          },
          {
            id: 3,
            position: "Ronchi",
            isChecked: false,
          },
          {
            id: 4,
            position: "Wheeze",
            isChecked: false,
          },

          {
            id: 5,
            position: "Normal",
            isChecked: false,
          },

          {
            id: 6,
            position: "All",
            isChecked: false,
          },
        ],
      },
      {
        id: 4,
        position: "Position 3",
        optionid: 1,
        options: [
          {
            id: 1,
            position: "Coarse crackle",
            isChecked: false,
          },
          {
            id: 2,
            position: "Fine crackle",
            isChecked: false,
          },
          {
            id: 3,
            position: "Ronchi",
            isChecked: false,
          },
          {
            id: 4,
            position: "Wheeze",
            isChecked: false,
          },

          {
            id: 5,
            position: "Normal",
            isChecked: false,
          },

          {
            id: 6,
            position: "All",
            isChecked: false,
          },
        ],
      },
      {
        id: 5,
        position: "Position 4",
        optionid: 1,
        options: [
          {
            id: 1,
            position: "Coarse crackle",
            isChecked: false,
          },
          {
            id: 2,
            position: "Fine crackle",
            isChecked: false,
          },
          {
            id: 3,
            position: "Ronchi",
            isChecked: false,
          },
          {
            id: 4,
            position: "Wheeze",
            isChecked: false,
          },

          {
            id: 5,
            position: "Normal",
            isChecked: false,
          },

          {
            id: 6,
            position: "All",
            isChecked: false,
          },
        ],
      },
      {
        id: 6,
        position: "Position 5",
        optionid: 1,
        options: [
          {
            id: 1,
            position: "Coarse crackle",
            isChecked: false,
          },
          {
            id: 2,
            position: "Fine crackle",
            isChecked: false,
          },
          {
            id: 3,
            position: "Ronchi",
            isChecked: false,
          },
          {
            id: 4,
            position: "Wheeze",
            isChecked: false,
          },

          {
            id: 5,
            position: "Normal",
            isChecked: false,
          },

          {
            id: 6,
            position: "All",
            isChecked: false,
          },
        ],
      },
      {
        id: 7,
        position: "Position 6",
        optionid: 1,
        options: [
          {
            id: 1,
            position: "Coarse crackle",
            isChecked: false,
          },
          {
            id: 2,
            position: "Fine crackle",
            isChecked: false,
          },
          {
            id: 3,
            position: "Ronchi",
            isChecked: false,
          },
          {
            id: 4,
            position: "Wheeze",
            isChecked: false,
          },

          {
            id: 5,
            position: "Normal",
            isChecked: false,
          },

          {
            id: 6,
            position: "All",
            isChecked: false,
          },
        ],
      },
    ])
    settags(SymptomsData)
    setLifeStyleHabits(LifeStyleHabitsData)
    setChronicSymptomsData(ChronicDiseasesData)
    setChiefSymptomsData(ChiefComplaintsData)
    setRecordings([
      {
        id: 0,
        name: "Rec 0",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn0,
        key: "p0_audio",

      },
      {
        id: 1,
        name: "Rec 1",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn1,
        key: "p1_audio",
      },
      {
        id: 2,
        name: "Rec 2",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn2,
        key: "p2_audio",
      },
      {
        id: 3,
        name: "Rec 3",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn3,
        key: "p3_audio",
      },
      {
        id: 4,
        name: "Rec 4",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn4,
        key: "p4_audio",
      },
      {
        id: 5,
        name: "Rec 5",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn5,
        key: "p5_audio",
      },
      {
        id: 6,
        name: "Rec 6",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungs.btn6,
        key: "p6_audio",
      },
    ])
    setRecordingsPosterior([
      {
        id: 7,
        name: "Rec 7",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungsPosterior.btn7,
        key: "p7_audio",

      },
      {
        id: 8,
        name: "Rec 8",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungsPosterior.btn8,
        key: "p8_audio",
      },
      {
        id: 9,
        name: "Rec 9",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungsPosterior.btn9,
        key: "p9_audio",
      },
      {
        id: 10,
        name: "Rec 10",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungsPosterior.btn10,
        key: "p10_audio",
      },
      {
        id: 11,
        name: "Rec 11",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungsPosterior.btn11,
        key: "p11_audio",
      },
      {
        id: 12,
        name: "Rec 12",
        sound: "",
        duration: "",
        file: "",
        State: null,
        style: lungsPosterior.btn12,
        key: "p12_audio",
      },
    ])


  }





  return (
    <AddPatientContext.Provider value={{
      resetStateObj,
      patientstatus,
      patientname,
      patientid,
      patientAge,
      patientGender,
      patientWeight,
      patientTemperture,
      patientOxygenLevel,
      patientBloodPressure,
      ChiefSymptomsData,
      ChronicSymptomsData,
      LifeStyleHabits,
      additionalNotes,
      filteredChiefSymptoms,
      filteredChronicSymptoms,
      filteredLifeStyle,
      tags,
      AnteriorTagging,
      filteredAnteriorTags,
      PosteriorTagging,
      filteredPosteriorTags,
      recordings,
      recordingsPosterior,
      setRecordingsPosterior,
      setRecordings,
      setpatientstatus,
      setpatientname,
      setpatientid,
      setpatientAge,
      setpatientGender,
      setpatientWeight,
      setpatientTemperature,
      setpatientPatientOxygenLevel,
      setpatientBloodPressure,
      setChiefSymptomsData,
      setChronicSymptomsData,
      setLifeStyleHabits,
      setaddtionalNotes,
      settags,
      setAnteriorTagging,
      setPosteriorTagging,
      handleChiefSymptomsQuestionSelect,
      handleChronicSymptomsQuestionSelect,
      handleLifeStyleHabitsQuestionSelect,
      handleChiefOptionSelect,
      handleChronicOptionSelect,
      handleLifeStyleHabitsOptionSelect,
      handleFilteringofForm,
      handleTaggingAllAnteriorPosition,
      handleTagDiscarding,
      handleAnteriorPositionTagging,
      handleAnteriorFiltering,
      setfilteredAnteriorTags,
      handlePosteriorfiltering,
      setfilteredPosteriorTags,
      setChiefSymptomsData,
      setChronicSymptomsData,
      setLifeStyleHabits,
      newlyCreatedPatientId,
      setNewlyCreatedPatientId,
      newlyCreatedPatientLungsId,
      setNewlyCreatedPatientLungsId,
      newlyCreatedPatientMoreDetailId,
      setNewlyCreatedPatientMoreDetailId,
      sessionNo,
      setSessionNo,
      diagonsisNotes,
      setDiagonsisNotes,
      handleClearAddPatientData


    }}>
      {children}
    </AddPatientContext.Provider>
  );
};

export const lungs = StyleSheet.create({
  wrapper: {
    position: "relative",
    width: wp("80%"),
    aspectRatio: 8 / 9,

  },
  img: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,

  },
  btn_wrapper: {
    width: "100%",
    height: "100%",
    aspectRatio: 8 / 9,
    zIndex: 10
  },
  btn: {
    position: "absolute"
  },

  tags: {
    fontSize: 8,
    paddingHorizontal: 2,
    paddingVertical: 1,
    backgroundColor: "white",
    display: "flex",
    alignSelf: "flex-start",
    marginVertical: 1,
    borderRadius: 2

  },
  btn0: {

    width: "20%",
    height: "12%",
    position: "absolute",
    top: "5%",
    left: "40%",


  },
  btn1: {

    width: "40%",
    height: "33%",
    borderTopStartRadius: wp("200%"),
    borderTopEndRadius: wp("20%"),
    position: "absolute",
    top: "19%",
    left: "6%",

  },
  btn2: {

    width: "40%",
    height: "33%",
    borderTopEndRadius: wp("50%"),
    borderTopStartRadius: wp("10%"),
    position: "absolute",
    top: "18%",
    right: "6%",

  },
  btn3: {

    width: "46%",
    height: "20%",
    borderBottomStartRadius: wp("5%"),
    position: "absolute",
    top: "53%",
    left: "2%",
    transform: [{ rotateZ: "3deg" }],

  },
  btn4: {
    width: "42%",
    height: "20%",
    borderBottomStartRadius: wp("5%"),
    position: "absolute",
    top: "53%",
    right: "2%",
    transform: [{ rotateZ: "-6deg" }],

  },
  btn5: {

    width: "46%",
    height: "25%",
    borderBottomEndRadius: wp("35%"),
    position: "absolute",
    top: "74%",
    left: "1%",
    transform: [{ rotateZ: "6deg" }],

  },
  btn6: {
    width: "42%",
    height: "25%",
    borderBottomStartRadius: wp("35%"),
    borderBottomEndRadius: wp("8%"),
    position: "absolute",
    top: "74%",
    right: "1%",
    transform: [{ rotateZ: "-6deg" }],

  }

})

export const lungsPosterior = StyleSheet.create({
  wrapper: {
    position: "relative",
    width: wp("80%"),
    aspectRatio: 28 / 30,
  },
  img: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,

  },
  btn_wrapper: {
    width: "100%",
    height: "100%",
    aspectRatio: 28 / 30,
    zIndex: 10
  },
  button_wrapper: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
  btn: {
    position: "absolute"
  },
  tags: {
    fontSize: 8,
    paddingHorizontal: 2,
    paddingVertical: 1,
    backgroundColor: "white",
    display: "flex",
    alignSelf: "flex-start",
    marginVertical: 1,
    borderRadius: 2

  },

  btn7: {
    width: "40%",
    height: "33%",
    borderTopStartRadius: wp("200%"),
    borderTopEndRadius: wp("20%"),
    position: "absolute",
    top: "19%",
    left: "6%",



  },
  btn8: {
    width: "40%",
    height: "33%",
    borderTopEndRadius: wp("50%"),
    borderTopStartRadius: wp("10%"),
    position: "absolute",
    top: "18%",
    right: "6%",

  },
  btn9: {
    width: "46%",
    height: "20%",
    borderBottomStartRadius: wp("5%"),
    position: "absolute",
    top: "53%",
    left: "2%",
    transform: [{ rotateZ: "3deg" }],

  },
  btn10: {
    width: "42%",
    height: "20%",
    borderBottomStartRadius: wp("5%"),
    position: "absolute",
    top: "53%",
    right: "2%",
    transform: [{ rotateZ: "-6deg" }],

  },
  btn11: {
    width: "46%",
    height: "25%",
    borderBottomEndRadius: wp("35%"),
    position: "absolute",
    top: "74%",
    left: "1%",
    transform: [{ rotateZ: "6deg" }],


  },
  btn12: {
    width: "42%",
    height: "25%",
    borderBottomStartRadius: wp("35%"),
    borderBottomEndRadius: wp("8%"),
    position: "absolute",
    top: "74%",
    right: "1%",
    transform: [{ rotateZ: "-6deg" }],

  },

})

