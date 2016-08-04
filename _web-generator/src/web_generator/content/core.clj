(ns web-generator.content.core
  (:require [clj-yaml.core :as yaml]))

(defn- filename
  [name]
  (str "src/web_generator/content/" name ".yaml"))

(def ^:private load-content-file (comp yaml/parse-string slurp filename))

(def work-experience (load-content-file "work_experience"))
(def education (load-content-file "education"))
