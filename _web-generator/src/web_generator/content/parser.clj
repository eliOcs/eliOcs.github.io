(ns web-generator.content.parser
  (:require [clj-time.core :as time])
  (:require [clj-yaml.core :as yaml]))

(defn parse-date
  [date]
  (let [[day month year] (map read-string (clojure.string/split date #"/"))]
    (time/date-time year month day)))

(defn parse-period
  [{start :start end :end}]
  {:start (parse-date start) :end (parse-date end)})

(defn parse-periods
  [work-experience]
  (map #(assoc % :period (parse-period (:period %))) work-experience))

(defn parse
  [yaml]
  (->
    (yaml/parse-string yaml)
    (parse-periods)))
