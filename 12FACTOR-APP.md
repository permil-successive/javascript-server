# Twelve-Factor App methodology

The **Twelve-Factor App methodology** is a methodology for building **software-as-a-service** applications. These best practices are designed to enable applications to be built with portability and resilience when deployed to the web. The methodology was drafted by developers at _Heroku_, a platform-as-a-service company, and was first presented by _Adam Wiggins circa in 2011_. It is a triangulation on ideal practices for app development, paying particular attention to the dynamics of the organic growth of an app over time, the dynamics of collaboration between developers working on the app’s codebase, and **avoiding the cost of software erosion**.

# Advantages of A Twelve-Factor App methology
* Use declarative formats for setup automation, to minimize time and cost for new developers joining the project

* Have a clean contract with the underlying operating system, offering maximum portability between execution environments

* Are suitable for deployment on modern cloud platforms, obviating the need for servers and systems administration

* Minimize divergence between development and production, enabling continuous deployment for maximum agility

* can scale up without significant changes to tooling, architecture, or development practices.



# The Twelve Factors
01. **Codebase** : There should be exactly one codebase for a deployed service with the codebase being used for many deployments. A twelve-factor app is always tracked in a _version control_ system, such as **Git**. A copy of the revision tracking database is known as a code repository, often shortened to code repo or just repo.

02. **Dependencies** : All dependencies should be declared, with no implicit reliance on system tools or libraries. A twelve-factor app never relies on implicit existence of system-wide packages. It declares all dependencies, completely and exactly, via a dependency declaration manifest.

03. **Config** : Configuration that varies between deployments should be stored in the environment. Apps sometimes store config as constants in the code. This is a violation of twelve-factor, which requires **strict separation of config from code**. Config varies substantially across deploys, code does not.

04. **Backing services** : All backing services are treated as attached resources and attached and detached by the execution environment. The code for a twelve-factor app makes no distinction between local and third party services. To the app, both are attached resources, accessed via a URL or other locator/credentials stored in the config.

05. **Build, release, run** : The delivery pipeline should strictly consist of build, release, run. The twelve-factor app uses strict separation between the build, release, and run stages.

  >> A codebase is transformed into a (non-development) deploy through three stages:
  >> * **The build stage** is a transform which converts a code repo into an executable bundle known as a build. Using a version of the code at a commit specified by the deployment process, the build stage fetches vendors dependencies and compiles binaries and assets.

  >> * **The release stage** takes the build produced by the build stage and combines it with the deploy’s current config. The resulting release contains both the build and the config and is ready for immediate execution in the execution environment.

  >> * **The run stage / runtime** runs the app in the execution environment, by launching some set of the app’s processes against a selected release.


06. **Processes** : Applications should be deployed as one or more stateless processes with persisted data stored on a backing service, typically a database.

07. **Port binding** : Self-contained services should make themselves available to other services by specified ports. The twelve-factor app is completely self-contained and does not rely on runtime injection of a webserver into the execution environment to create a web-facing service.

08. **Concurrency** : Concurrency is advocated by scaling individual processes. In the twelve-factor app, processes are a first class citizen. Processes in the twelve-factor app take strong cues from the unix process model for running service daemons. For example, HTTP requests may be handled by a web process, and long-running background tasks handled by a worker process.

09. **Disposability** : Fast startup and shutdown are advocated for a more robust and resilient system. The twelve-factor app’s processes are disposable, meaning they can be started or stopped at a moment’s notice. This facilitates fast elastic scaling, rapid deployment of code or config changes, and robustness of production deploys.

>>Processes should strive to minimize startup time. Ideally, a process takes a few seconds from the time the launch command is executed until the process is up and ready to receive requests or jobs.

10. **Dev/Prod parity** : All environments should be as similar as possible. there have been substantial gaps between development and production. The twelve-factor app is designed for continuous deployment by keeping the gap between development and production small.

11. **Logs** : Applications should produce logs as event streams and leave the execution environment to aggregate. Logs provide visibility into the behavior of a running app. In server-based environments they are commonly written to a file on disk (a “logfile”); but this is only an output format.
Logs are the stream of aggregated, time-ordered events collected from the output streams of all running processes and backing services. A twelve-factor app never concerns itself with routing or storage of its output stream

12. **Admin Processes** : Any needed admin tasks should be kept in source control and packaged with the application. One-off admin processes should be run in an identical environment as the regular long-running processes of the app. They run against a release, using the same codebase and config as any process run against that release. Admin code must ship with application code to avoid synchronization issues.
