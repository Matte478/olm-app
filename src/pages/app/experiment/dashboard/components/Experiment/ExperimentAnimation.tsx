import React from 'react'
import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Color3,
  ArcRotateCamera,
  Tools,
  PointLight,
  SceneLoader,
  StandardMaterial,
  Texture,
} from '@babylonjs/core'
import SceneComponent from 'babylonjs-hook'
import { CButton } from '@coreui/react'

type Props = {}

let called = 1
let dissapeard = 0
let led_intensity = 0
let range = 0
let time = 0
let step = 0.5

const onSceneReady = (scene: any) => {
  scene.clearColor = Color3.White()
  // scene.clearColor = Color3.Red()

  let camera = new ArcRotateCamera(
    'arcCamera',
    Tools.ToRadians(45),
    Tools.ToRadians(45),
    10.0,
    Vector3.Zero(),
    scene,
  )
  const canvas = scene.getEngine().getRenderingCanvas()
  camera.attachControl(canvas, true)

  camera.keysUp.push(87)
  camera.keysDown.push(83)
  camera.keysLeft.push(65)
  camera.keysRight.push(68)

  let light = new PointLight('pointLight', new Vector3(0, 10, 0), scene)
  light.parent = camera
  light.intensity = 1.0

  // let light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
  // light.intensity = 1

  SceneLoader.ImportMesh('', '/model/', 'vrch.babylon', scene, function (newMeshes) {
    newMeshes.forEach(function (element) {
      console.log(element.name)
    })
  })
}

const onRender = (scene: any) => {
  let fanCover1 = scene.getMeshByID('fan_cover1')
  let fanCover2 = scene.getMeshByID('fan_cover2')
  let frontTopBlack = scene.getMeshByID('front_top_black')

  let insideLed = scene.getMeshByID('inside_led_yellow')
  let insideLedBottom = scene.getMeshByID('inside_yellow_bulb_bottom')

  let fan = scene.getMeshByID('fan')

  if (fanCover1 && fanCover2 && called) {
    addMaterial(scene.getMeshByID('case1'), 'case', scene)
    addMaterial(scene.getMeshByID('case2'), 'case', scene)

    addMaterial(fanCover1, 'case', scene)
    addMaterial(fanCover2, 'case', scene)

    addMaterial(scene.getMeshByID('front_bottom_black'), 'fan', scene)
    addMaterial(frontTopBlack, 'fan', scene)
    addMaterial(scene.getMeshByID('back_black'), 'fan', scene)

    addMaterial(scene.getMeshByID('legs'), 'fan', scene)

    addMaterial(fan, 'fan', scene)

    addMaterial(insideLed, 'light_bulb', scene)
    addMaterial(insideLedBottom, 'light_bulb', scene)

    addMaterial(scene.getMeshByID('top_bulb_cable_red'), 'cable_red', scene)
    addMaterial(scene.getMeshByID('top_bulb_cable_black'), 'cable_black', scene)

    addMaterial(scene.getMeshByID('top_bulb_cable_black.001'), 'cable_black', scene)
    addMaterial(scene.getMeshByID('top_bulb_cable_black.002'), 'cable_black', scene)

    addMaterial(scene.getMeshByID('top_bulb_cable_red.001'), 'cable_red', scene)
    addMaterial(scene.getMeshByID('top_bulb_cable_red.002'), 'cable_red', scene)

    addMaterial(scene.getMeshByID('bulb_case_1'), 'bulb_case', scene)
    addMaterial(scene.getMeshByID('bulb_case_2'), 'bulb_case', scene)

    addMaterial(scene.getMeshByID('Cube.001'), 'white_case', scene)
    called = 0
  }

  if (fanCover1 && fanCover2 && dissapeard) {
    console.log(fanCover1.material.alpha)
    fanCover1.material.alpha -= 0.01
    fanCover2.material.alpha -= 0.01
    frontTopBlack.material.alpha -= 0.01
    if (fanCover1.material.alpha <= 0) dissapeard = 0
  }

  if (fan) {
    fan.rotation.y += range / 1100
  }
  if (insideLed) {
    //led_intensity = 0 -> žltá, ak 1 čierna -> Color3(1,1,0) žltá 000 čierna
    insideLed.material.diffuseColor = new Color3(led_intensity, led_intensity, 0)
  }
}

function addMaterial(item: any, name: string, scene: any) {
  let material: any
  switch (name) {
    case 'case':
      material = new StandardMaterial('material1', scene)
      material.diffuseTexture = new Texture('/img/silver_texture.png', scene)
      material.roughness = 0.5
      break
    case 'light_bulb':
      material = new StandardMaterial('material2', scene)
      material.diffuseColor = Color3.Yellow()
      break
    case 'fan':
      material = new StandardMaterial('material3', scene)
      material.diffuseColor = Color3.Black()
      break
    case 'cable_red':
      material = new StandardMaterial('material4', scene)
      material.diffuseColor = Color3.Red()
      break
    case 'cable_black':
      material = new StandardMaterial('material5', scene)
      material.diffuseColor = Color3.Black()
      break
    case 'bulb_case':
      material = new StandardMaterial('material6', scene)
      material.diffuseColor = new Color3(0.52, 0.627, 0.627)
      break
    case 'white_cae':
      material = new StandardMaterial('material7', scene)
      material.diffuseColor = Color3.White()
      break
  }
  item.material = material
}

const ExperimentAnimation = ({}: Props) => {
  return (
    <div className="d-flex flex-column">
    {/* <div> */}
      <SceneComponent
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
        id="canvas"
        style={{ width: '100%' }}
      />
      <CButton
        onClick={() => {
          // dissapeard = 0
        }}
      >
        Remove cover
      </CButton>
    </div>
  )
}

export default ExperimentAnimation
