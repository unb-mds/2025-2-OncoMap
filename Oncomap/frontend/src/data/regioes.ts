import type { Feature, FeatureCollection, Geometry } from 'geojson';


import AC from './estados/macroregions-ac-12.json';
import AM from './estados/macroregions-am-13.json';
import MG from './estados/macroregions-mg-31.json';
import SP from './estados/macroregions-sp-35.json';
import RJ from './estados/macroregions-rj-33.json';
import PR from './estados/macroregions-pr-41.json';
import SC from './estados/macroregions-sc-42.json';
import RS from './estados/macroregions-rs-43.json';
import BA from './estados/macroregions-ba-29.json';
import PE from './estados/macroregions-pe-26.json';
import CE from './estados/macroregions-ce-23.json';
import RN from './estados/macroregions-rn-24.json';
import PB from './estados/macroregions-pb-25.json';
import PI from './estados/macroregions-pi-22.json';
import MA from './estados/macroregions-ma-21.json';
import PA from './estados/macroregions-pa-15.json';
import TO from './estados/macroregions-to-17.json';
import AL from './estados/macroregions-al-27.json';
import SE from './estados/macroregions-se-28.json';
import GO from './estados/macroregions-go-52.json';
import MT from './estados/macroregions-mt-51.json';
import MS from './estados/macroregions-ms-50.json';
import DF from './estados/macroregions-df-53.json';
import RO from './estados/macroregions-ro-11.json';
import RR from './estados/macroregions-rr-14.json';
import AP from './estados/macroregions-ap-16.json';
import ES from './estados/macroregions-es-32.json';





interface EstadoProperties {
  codarea: string;
  regiao?: string; 
  centroide?: [number, number];
  name?: string;
  nome?: string;
  sigla?: string;
  [key: string]: unknown; 
}

type EstadoFeature = Feature<Geometry, EstadoProperties>;


type EstadoFeatureCollection = FeatureCollection<Geometry, EstadoProperties>;

const addRegionToFeatures = (
  features: EstadoFeature[],
  regionKey: string
): EstadoFeature[] => {
  return features.map(feature => ({
    ...feature,
    properties: {
      ...feature.properties,
      regiao: regionKey,
    },
  }));
};


export const regioesGeoJson: Record<string, EstadoFeatureCollection> = {
  norte: {
    type: 'FeatureCollection',
    features: addRegionToFeatures(
      [
        ...AC.features, 
        ...AM.features, 
        ...PA.features,
        ...TO.features,
        ...RO.features,
        ...RR.features,
        ...AP.features
      ] as EstadoFeature[],
      'norte'
    ),
  },
  nordeste: {
    type: 'FeatureCollection',
    features: addRegionToFeatures(
      [
        ...BA.features,
        ...PE.features,
        ...CE.features,
        ...RN.features,
        ...PB.features,
        ...PI.features,
        ...MA.features,
        ...AL.features,
        ...SE.features
      ] as EstadoFeature[],
      'nordeste'
    ),
  },
  'centro-oeste': {
    type: 'FeatureCollection',
    features: addRegionToFeatures(
      [
        ...GO.features,
        ...MT.features,
        ...MS.features,
        ...DF.features
      ] as EstadoFeature[],
      'centro-oeste'
    ),
  },
  sudeste: {
    type: 'FeatureCollection',
    features: addRegionToFeatures(
      [
        ...SP.features, 
        ...RJ.features, 
        ...MG.features,
        ...ES.features
      ] as EstadoFeature[],
      'sudeste'
    ),
  },
  sul: {
    type: 'FeatureCollection',
    features: addRegionToFeatures(
      [
        ...PR.features, 
        ...SC.features, 
        ...RS.features
      ] as EstadoFeature[],
      'sul'
    ),
  },
};