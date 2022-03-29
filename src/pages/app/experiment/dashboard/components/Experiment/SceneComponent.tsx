import { Engine, Scene } from "@babylonjs/core";
import { useEffect, useRef } from "react";

export function SceneComponent({
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    ...rest
}: any) {
    const reactCanvas = useRef(null)

    useEffect(() => {
        if (reactCanvas.current) {
            const engine = new Engine(
                reactCanvas.current,
                antialias,
                engineOptions,
                adaptToDeviceRatio
            );
            const scene = new Scene(engine, sceneOptions)

            if (scene.isReady()) {
                onSceneReady(scene)
            } else {
                scene.onReadyObservable.addOnce((scene) => onSceneReady(scene))
            }

            engine.runRenderLoop(() => {
                if (typeof onRender === "function") {
                    onRender(scene)
                }
                scene.render()
            });
            const resize = () => {
                scene.getEngine().resize()
            };
            if (window) {
                window.addEventListener("resize", resize)
            }
            return () => {
                scene.getEngine().dispose();
                if (window) {
                    window.removeEventListener("resize", resize)
                }
            }
        }
    }, [
        adaptToDeviceRatio,
        antialias,
        engineOptions,
        onRender,
        onSceneReady,
        sceneOptions,]);
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <canvas ref={reactCanvas} {...rest} />;
}