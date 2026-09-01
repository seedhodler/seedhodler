# Build Blockchain Commons' bc-seedtool for the SSKR external-recovery CI check.
#
# The upstream Dockerfile is bit-rotted: it pins ubuntu 20.04 (focal) and runs
# apt.llvm.org's llvm.sh to install clang-10, but that script no longer supports
# focal, so the upstream image no longer builds. This rebuilds seedtool on a
# supported base with the distro's own clang + libc++ (set_build_paths.sh does
# not pin a compiler; it reads CC/CXX from the environment).
#
# The build context is a checkout of seedtool-cli at the pinned commit with its
# submodules already fetched (done in the CI step), so build.sh's own
# git-submodule steps are dropped, and the per-library `make check` test suites
# are skipped since only the binary is needed here.
FROM ubuntu:22.04
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential autoconf automake libtool pkg-config \
      clang libc++-dev libc++abi-dev ca-certificates \
    && rm -rf /var/lib/apt/lists/*
ENV CC=clang
ENV CXX=clang++
ENV CXXFLAGS=-stdlib=libc++
ENV LDFLAGS=-stdlib=libc++
COPY . /seedtool-cli
WORKDIR /seedtool-cli
RUN sed -i '/git submodule/d; s/make check/make/g' build.sh && ./build.sh
ENTRYPOINT ["/seedtool-cli/src/seedtool"]
