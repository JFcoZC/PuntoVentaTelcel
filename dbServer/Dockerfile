#This file creates a docker image that contains all the dependencies the apache application
#requires

#Build image with latest Ubuntu image version
FROM ubuntu:latest

#Run all the commands for basic udpates requires for ubuntu and autimatically put yes to all
RUN apt-get update -y

#Run all the comands to install postgresql
RUN apt-get install postgresql postgresql-contrib -y

# Run the rest of the commands as the ``postgres`` user created by the ``postgres-10`` package when it was ``apt-get installed``
USER postgres

#---------------------------------------------------------------------------------------
# Create a PostgreSQL role/user named ``admin`` with ``postgres`` as the password and
# then create a database `supervisionr` owned by the ``admin`` role/user.
# Note: here we use ``&&\`` to run commands one after the other - the ``\``
#       allows the RUN command to span multiple lines.
#---------------------------------------------------------------------------------------
RUN    /etc/init.d/postgresql start &&\
    psql --command "CREATE USER admin WITH SUPERUSER PASSWORD 'postgres';" &&\createdb -O admin supervision

#----------------------------------------------------------------------------------------
# Adjust PostgreSQL configuration so that remote connections to the
# database are possible: 2 MODIFICATIONS REQUIRED.
#----------------------------------------------------------------------------------------
#1)Add 0.0.0.0/0
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/10/main/pg_hba.conf

#2)Add ``listen_addresses`` to ``/etc/postgresql/10/main/postgresql.conf``
RUN echo "listen_addresses='*'" >> /etc/postgresql/10/main/postgresql.conf


#Epose port default postgresql port
EXPOSE 5432

# Add VOLUMEs to allow backup of config, logs and databases
VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

# Set the default command to run when starting the container
CMD ["/usr/lib/postgresql/10/bin/postgres", "-D", "/var/lib/postgresql/10/main", "-c", "config_file=/etc/postgresql/10/main/postgresql.conf"]
