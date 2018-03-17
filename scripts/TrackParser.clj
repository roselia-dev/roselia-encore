(ns 'moe.roselia.encore
    (:require '[clojure.string :as string]))
(defn match-tracks [s] 
    (map #(%1 1) (re-seq (re-pattern "\\d+\\.(.*)") s)))
(defn js-array [xs]
  (str "[" (join ", " (map #(str "\"" % "\"") xs)) "]"))
