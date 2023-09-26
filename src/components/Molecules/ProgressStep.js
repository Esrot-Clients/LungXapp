import React from 'react'
import ProgressSteps, {
    Title,
    Content,
  } from "@joaosousa/react-native-progress-steps";
import colors from '../../constants/colors';
import { Text,View } from "react-native";

  
const steps = [
  {
    id: 1,
    title: <Title><Text style={{ fontSize: 11, }}>Anterior</Text></Title>,
  },
  {
    id: 2,
    title: <Title><Text style={{ fontSize: 11 }}>Posterior</Text></Title>,
  },
  {
    id: 3,
    title: <Title><Text style={{ fontSize: 11, }}>Tag Anterior</Text></Title>,
  },
  {
    id: 4,
    title: <Title><Text style={{ fontSize: 11 }}>Tag Posterior</Text></Title>,
  },
  {
    id: 5,
    title: <Title><Text style={{ fontSize: 11 }}>Report</Text></Title>,
  },
];

export default function ProgressStep(props) {
  return (
    <ProgressSteps
          steps={steps}
          currentStep={props.currrentStep}
          orientation={"horizontal"}
          onStepChange={props.setCurrentStep}
          colors={{
            title: {
              text: {
                normal: "rgba(0,0,0,.5)",
                active: colors.green,
                completed: colors.green,
                fontSize: 10
              },
            },
            marker: {
              text: {
                normal: "rgba(0,0,0,.5)",
                active: colors.green,
                completed: "#fff",
                fontSize: 10
              },
              line: {
                normal: "#ff9c84",
                // normal:  "rgba(0,0,0,.2)",
                active: colors.green,
                completed: colors.green,
                height: 1
              },
            },
          }}
        />
  )
}
