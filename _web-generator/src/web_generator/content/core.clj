(ns web-generator.content.core
  (:require [clj-yaml.core :as yaml]))

(defn- filename
  [name extension]
  (str "src/web_generator/content/" name "." extension))

(defn- yaml-filename
  [name]
  (filename name "yaml"))

(defn- txt-filename
  [name]
  (filename name "txt"))

(def ^:private load-yaml-file (comp yaml/parse-string slurp yaml-filename))

(def ^:private load-txt-file (comp slurp txt-filename))

(def resume
  {:summary (load-txt-file "resume/summary")
   :work-experience (load-yaml-file "resume/work_experience")
   :education (load-yaml-file "resume/education")})

(def interesting-content (load-yaml-file "interesting-content"))
