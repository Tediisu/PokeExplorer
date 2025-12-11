// src/screens/ARCaptureScene.tsx
import React, { useState } from 'react';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  ViroConstants,
  Viro3DObject,
  ViroNode,
  ViroSphere,
} from '@reactvision/react-viro';

type ARCaptureSceneProps = {
  pokemonId: number;
  onCaught: (pokemonId: number) => void;
};

type NavigatorProps = {
  pokemonId: number;
  onCaught: (pokemonId: number) => void;
};

const PokemonARScene: React.FC<{
  sceneNavigator: any;
}> = ({ sceneNavigator }) => {
  const { pokemonId, onCaught } = sceneNavigator.viroAppProps as ARCaptureSceneProps;

  const [tracking, setTracking] = useState(false);
  const [caught, setCaught] = useState(false);

  const onInitialized = (state: number /* ViroTrackingState */, reason: number) => {
    if (state === ViroConstants.TRACKING_NORMAL) {
      setTracking(true);
    }
  };

  const handleThrowPokeball = () => {
    if (caught) return;

    // here you’d normally check distance / collision, etc.
    setCaught(true);
    onCaught(pokemonId);
    // optionally close AR after a delay – navigation happens in wrapper
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {/* Status text */}
      <ViroText
        text={
          !tracking
            ? 'Move your phone to detect a surface...'
            : caught
            ? 'Gotcha! Pokémon caught.'
            : 'Tap the Pokéball to catch!'
        }
        position={[0, 0.1, -0.8]}
        style={{ fontSize: 20, color: '#ffffff', textAlign: 'center' }}
      />

      {/* Fake Pokémon – you can swap for a 3D model with Viro3DObject */}
      <ViroSphere
        radius={0.1}
        position={[0, 0, -0.8]}
        materials={['pokemonBody']}
      />

      {/* “Pokéball” the user taps to catch */}
      <ViroNode position={[0, -0.1, -0.6]} onClick={handleThrowPokeball}>
        <ViroSphere
          radius={0.07}
          materials={['pokeball']}
        />
      </ViroNode>
    </ViroARScene>
  );
};

// Navigator wrapper used as a React Native screen
export const ARCaptureScreen: React.FC<NavigatorProps> = ({ pokemonId, onCaught }) => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: PokemonARScene,
      }}
      viroAppProps={{ pokemonId, onCaught }}
      style={{ flex: 1 }}
    />
  );
};

// Somewhere in your Viro setup (e.g., index or a separate file),
// register the materials:
import { ViroMaterials } from '@reactvision/react-viro';

ViroMaterials.createMaterials({
  pokemonBody: {
    diffuseColor: '#FFCB05',
  },
  pokeball: {
    diffuseColor: '#FF0000',
  },
});
