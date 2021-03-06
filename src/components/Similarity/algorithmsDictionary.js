import React from "react"
import {constructSimilarityMaps, constructWeightedSimilarityMaps, runAlgorithm,} from "../../services/similarity"
import {getFetchLouvainCypher, similarityParams} from "../../services/queries";
import JaccardForm from "./JaccardForm";
import SimilarityResult from "./SimilarityResult";
import CosineForm from "./CosineForm";
import PearsonForm from "./PearsonForm";
import OverlapForm from "./OverlapForm";
import EuclideanForm from "./EuclideanForm";

const constructStreamingQueryGetter = (callAlgorithm, constructMapsFn) => (item, relationshipType, category) =>
  `${constructMapsFn(item, relationshipType, category)}

${callAlgorithm}

YIELD item1, item2, similarity
RETURN algo.asNode(item1) AS from, algo.asNode(item2) AS to, similarity
ORDER BY similarity DESC
LIMIT $limit`

const constructStoreQueryGetter = (callAlgorithm, constructMapsFn) => (item, relationshipType, category) =>
  `${constructMapsFn(item, relationshipType, category)}

${callAlgorithm}

YIELD nodes, similarityPairs, write, writeRelationshipType, writeProperty, min, max, mean, stdDev, p25, p50, p75, p90, p95, p99, p999, p100
RETURN nodes, similarityPairs, write, writeRelationshipType, writeProperty, min, max, mean, p95`

const constructFetchQuery = (item, writeRelationshipType) => {
  const itemNode1 = item ?  `(from:\`${item}\`)` : `(from)`
  const itemNode2 = item ?  `(to:\`${item}\`)` : `(to)`
  const rel =  `[rel:\`${writeRelationshipType}\`]`

  return `MATCH ${itemNode1}-${rel}-${itemNode2}
WHERE not (rel[$config.writeProperty] is null)
RETURN from, to, rel[$config.writeProperty] AS similarity
ORDER BY similarity DESC
LIMIT $limit`
}


export default {
  algorithmList: [
    "Jaccard",
    "Overlap",
    "Cosine",
    "Pearson",
    "Euclidean"

  ],
  algorithmDefinitions: {
    "Jaccard": {
      Form: JaccardForm,
      parametersBuilder: similarityParams,
      service: runAlgorithm,
      ResultView: SimilarityResult,
      parameters: {
        persist: true,
        writeProperty: "score",
        writeRelationshipType: "SIMILAR_JACCARD",
        concurrency: 8,
        similarityCutoff: 0.1,
        degreeCutoff: 0,
        write: true
      },
      streamQuery: constructStreamingQueryGetter("CALL algo.similarity.jaccard.stream(data, $config)", constructSimilarityMaps),
      storeQuery: constructStoreQueryGetter(`CALL algo.similarity.jaccard(data, $config)`, constructSimilarityMaps),
      getFetchQuery: constructFetchQuery,
      description: `measures similarities between sets. It is defined as the size of the intersection divided by the size of the union of two sets.`
    },
    "Overlap": {
      Form: OverlapForm,
      parametersBuilder: similarityParams,
      service: runAlgorithm,
      ResultView: SimilarityResult,
      parameters: {
        persist: true,
        writeProperty: "score",
        writeRelationshipType: "SIMILAR_OVERLAP",
        concurrency: 8,
        similarityCutoff: 0.1,
        degreeCutoff: 0,
        write: true
      },
      streamQuery: constructStreamingQueryGetter("CALL algo.similarity.overlap.stream(data, $config)", constructSimilarityMaps),
      storeQuery: constructStoreQueryGetter(`CALL algo.similarity.overlap(data, $config)`, constructSimilarityMaps),
      getFetchQuery: constructFetchQuery,
      description: `measures overlap between two sets. It is defined as the size of the intersection of two sets, divided by the size of the smaller of the two sets.`
    },

    "Cosine": {
      Form: CosineForm,
      parametersBuilder: similarityParams,
      service: runAlgorithm,
      ResultView: SimilarityResult,
      parameters: {
        persist: true,
        writeProperty: "score",
        writeRelationshipType: "SIMILAR_COSINE",
        concurrency: 8,
        similarityCutoff: 0.1,
        degreeCutoff: 0,
        write: true,
        weightProperty: "weight"
      },
      streamQuery: constructStreamingQueryGetter("CALL algo.similarity.cosine.stream(data, $config)", constructWeightedSimilarityMaps),
      storeQuery: constructStoreQueryGetter(`CALL algo.similarity.cosine(data, $config)`, constructWeightedSimilarityMaps),
      getFetchQuery: constructFetchQuery,
      description: ` the cosine of the angle between two n-dimensional vectors in an n-dimensional space. It is the dot product of the two vectors divided by the product of the two vectors' lengths (or magnitudes).`
    },

    "Pearson": {
      Form: PearsonForm,
      parametersBuilder: similarityParams,
      service: runAlgorithm,
      ResultView: SimilarityResult,
      parameters: {
        persist: true,
        writeProperty: "score",
        writeRelationshipType: "SIMILAR_PEARSON",
        concurrency: 8,
        similarityCutoff: 0.1,
        degreeCutoff: 0,
        write: true,
        weightProperty: "weight"
      },
      streamQuery: constructStreamingQueryGetter("CALL algo.similarity.pearson.stream(data, $config)", constructWeightedSimilarityMaps),
      storeQuery: constructStoreQueryGetter(`CALL algo.similarity.pearson(data, $config)`, constructWeightedSimilarityMaps),
      getFetchQuery: constructFetchQuery,
      description: `the covariance of the two n-dimensional vectors divided by the product of their standard deviations.`
    },

    "Euclidean": {
      Form: EuclideanForm,
      parametersBuilder: similarityParams,
      service: runAlgorithm,
      ResultView: SimilarityResult,
      parameters: {
        persist: true,
        writeProperty: "score",
        writeRelationshipType: "SIMILAR_EUCLIDEAN",
        concurrency: 8,
        similarityCutoff: 0.1,
        degreeCutoff: 0,
        write: true,
        weightProperty: "weight"
      },
      streamQuery: constructStreamingQueryGetter("CALL algo.similarity.euclidean.stream(data, $config)", constructWeightedSimilarityMaps),
      storeQuery: constructStoreQueryGetter(`CALL algo.similarity.euclidean(data, $config)`, constructWeightedSimilarityMaps),
      getFetchQuery: constructFetchQuery,
      description: `measures the straight line distance between two points in n-dimensional space.`
    },

  },
}
