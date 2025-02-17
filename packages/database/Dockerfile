# Use Node 18.18.2 image from the public ECR registry
FROM public.ecr.aws/docker/library/node:18.18-slim

# Arguments for project name and NPM version, which can be overridden during Docker build
ARG PROJECT=momentranks_types
ARG NPM=8.9.0

# Set non-interactive for apt installations
ENV DEBIAN_FRONTEND=noninteractive

# Update package lists, install dependencies and clean up to reduce image size
RUN apt update && \
    apt install -y -q --no-install-recommends sudo git gpg ca-certificates curl ripgrep && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

# Create a new user called 'sdev' with sudo access
RUN useradd --create-home -s /bin/bash sdev && \
    usermod -a -G sudo sdev && \
    echo '%sdev ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Switch to the workspace directory and change ownership to 'sdev'
WORKDIR /workspace/${PROJECT}
RUN chown -R sdev.sdev .

# Switch to the 'sdev' user
USER sdev

# Copy all files to the workspace, maintaining 'sdev' as the owner
COPY --chown=sdev:sdev . .

# Set the default command to execute
CMD ["pnpm", "run", "db:generate"]
