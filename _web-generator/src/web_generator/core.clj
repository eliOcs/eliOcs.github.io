(ns web-generator.core
  (:require [web-generator.content.core :as content]
            [clj-time.core :as time]
            [clj-time.format :as time-format]
            [hiccup.core :as hiccup])
  (:gen-class))

(def format-period-date
  (let [month-year-format (time-format/formatter "MMMM yyyy")]
    (fn [date] (time-format/unparse month-year-format date))))

(defn period-months
  [period]
  (int (/ (time/in-days (time/interval (:start period) (:end period))) 30)))

(defn format-period-length
  [period]
  (let [months (period-months period)]
    (str months " month" (if (not= months 1) "s"))))

(defn format-period
  [period]
  (str (format-period-date (:start period))
       " - "
       (format-period-date (:end period))
       ", "
       (format-period-length period)))

(defn work-experience-html
  [content]
  [:section [:div.job-entry
             [:h2.job-title (:job-title content)]
             [:p.period (format-period (:period content))]
             [:p.experience (:experience content)]]])

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (println (hiccup/html (work-experience-html (get content/work-experience 0)))))
